import time
from datetime import datetime, timedelta, timezone
import spotipy

# --- Configuration Constants from your script ---
MIN_DURATION_MS = 60_000
# EXCLUDE_KEYWORDS removed from global scope, will be constructed dynamically


def remove_in_batches(sp, playlist_id, uris, batch_size=100):
    """Helper function to remove items in batches"""
    for i in range(0, len(uris), batch_size):
        sp.playlist_remove_all_occurrences_of_items(
            playlist_id, uris[i: i + batch_size])


def run_update_for_user(sp, current_user_id, exclude_covers=False, exclude_remixes=False):
    """
    Refactored logic to run for a specific authenticated user.
    sp: Authenticated spotipy.Spotify object
    current_user_id: string ID of the user
    exclude_covers: bool, whether to exclude covers
    exclude_remixes: bool, whether to exclude remixes
    """
    print(f"--- Starting update for user: {current_user_id} ---")

    # Construct exclusion list
    exclude_keywords = ["instrumental", "Instrumental", "Live", "live", "version", "Version"]
    if exclude_covers:
        exclude_keywords.extend(["cover", "Cover"])
    if exclude_remixes:
        exclude_keywords.extend(["remix", "Remix", "mix", "Mix"])

    print(f"Exclusion keywords: {exclude_keywords}")

    # 1) Gather the list of artist IDs that the user follows
    artists = []
    after = None
    while True:
        resp = sp.current_user_followed_artists(limit=50, after=after)
        artists.extend(resp["artists"]["items"])
        if resp["artists"]["cursors"]["after"] is None:
            break
        after = resp["artists"]["cursors"]["after"]

    artist_ids = [a["id"] for a in artists]
    print(f"Found {len(artist_ids)} followed artists.")

    # 2) Identify new tracks released in the past 7 (or 3) days
    # Your script used 3 days in the logic, though commented 7.
    # Adjusted to 3 days as per your specific logic line.
    start_date_check = datetime.now(timezone.utc) - timedelta(days=3)

    new_tracks = []

    for artist_id in artist_ids:
        try:
            albums = sp.artist_albums(
                artist_id, album_type="album,single", limit=50)
        except Exception as e:
            print(f"Error fetching albums for artist {artist_id}: {e}")
            continue

        for alb in albums["items"]:
            rd = alb.get("release_date")
            precision = alb.get("release_date_precision")

            try:
                if precision == "day":
                    rd_dt = datetime.strptime(
                        rd, "%Y-%m-%d").replace(tzinfo=timezone.utc)
                elif precision == "month":
                    rd_dt = datetime.strptime(
                        rd, "%Y-%m").replace(tzinfo=timezone.utc)
                else:
                    rd_dt = datetime.strptime(
                        rd, "%Y").replace(tzinfo=timezone.utc)
            except ValueError:
                continue  # Skip if date format is weird

            if rd_dt >= start_date_check:
                try:
                    tracks = sp.album_tracks(alb["id"])["items"]
                    for t in tracks:
                        if t["duration_ms"] is not None and t["duration_ms"] < MIN_DURATION_MS:
                            continue

                        track_name = t["name"]
                        if any(keyword in track_name.lower() for keyword in exclude_keywords):
                            continue

                        new_tracks.append({
                            "uri":  t["uri"],
                            "date": rd_dt
                        })
                except Exception as e:
                    print(
                        f"Error processing tracks for album {alb['id']}: {e}")

    # 3) Remove duplicate URIs
    track_map = {}
    for track in new_tracks:
        uri = track["uri"]
        date = track["date"]
        if uri not in track_map or date > track_map[uri]:
            track_map[uri] = date

    sorted_tracks = sorted(
        [{"uri": uri, "date": date} for uri, date in track_map.items()],
        key=lambda x: x["date"],
        reverse=True
    )
    print(f"Found {len(sorted_tracks)} new tracks.")

    # 4) Find or Create Playlist
    playlist_name_target = "New Releases"
    playlists_response = sp.current_user_playlists(limit=50)
    playlists = playlists_response["items"]

    # Pagination for playlists just in case user has many
    while playlists_response.get('next'):
        playlists_response = sp.next(playlists_response)
        playlists.extend(playlists_response['items'])

    playlist = next(
        (p for p in playlists if p["name"].strip(
        ).lower() == playlist_name_target.lower()),
        None
    )

    if not playlist:
        playlist = sp.user_playlist_create(
            current_user_id, playlist_name_target, public=False)
        print(f'Created new playlist: {playlist_name_target}')
    else:
        print(f'Found existing playlist: {playlist_name_target}')

    playlist_id = playlist["id"]

    # 5) Retrieve current tracks to check for duplicates and old songs
    existing_items = []
    results = sp.playlist_items(
        playlist_id,
        fields="items(added_at,track(uri)),next",
        additional_types=["track"]
    )
    existing_items.extend(results["items"])
    while results.get("next"):
        results = sp.next(results)
        existing_items.extend(results["items"])

    # 6) Remove tracks added > 14 days ago
    two_weeks_ago = datetime.now(timezone.utc) - timedelta(days=14)
    old_uris = []
    existing_uris = set()

    for item in existing_items:
        if item["track"] and item["track"]["uri"]:
            uri = item["track"]["uri"]
            existing_uris.add(uri)
            # Check date
            added_at_str = item["added_at"]
            if added_at_str:
                # Fix ISO format usually returned by Spotify
                added_at_dt = datetime.fromisoformat(
                    added_at_str.replace("Z", "+00:00"))
                if added_at_dt < two_weeks_ago:
                    old_uris.append(uri)

    if old_uris:
        print(f"Removing {len(old_uris)} old tracks...")
        remove_in_batches(sp, playlist_id, old_uris)

    # 7) Add new tracks
    uris_to_add = [
        track["uri"]
        for track in sorted_tracks
        if track["uri"] not in existing_uris
    ]

    if uris_to_add:
       BATCH_SIZE = 100
       for idx in range(0, len(uris_to_add), BATCH_SIZE):
           batch = uris_to_add[idx: idx + BATCH_SIZE]
           if idx == 0:
               sp.playlist_add_items(
                   playlist_id=playlist_id, items=batch, position=0)
           else:
               sp.playlist_add_items(playlist_id=playlist_id, items=batch)
           print(f"Added batch of {len(batch)} tracks.")
    else:
        print("No new tracks to add.")

    return True
