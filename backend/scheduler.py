import time
import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from app import app
from models import db, User
from spotify_logic import run_update_for_user
from dotenv import load_dotenv

load_dotenv()


def get_auth_client(user):
    """
    Regenerates a token for a user using their saved Refresh Token
    """
    sp_oauth = SpotifyOAuth(
        client_id=os.getenv("SPOTIPY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI")
    )

    # This handles the magic of getting a new access token using the refresh token
    token_info = sp_oauth.refresh_access_token(user.refresh_token)

    # If the refresh token rotated (security feature), update DB
    if token_info.get('refresh_token') and token_info['refresh_token'] != user.refresh_token:
        print(f"Updating refresh token for user {user.spotify_id}")
        user.refresh_token = token_info['refresh_token']
        db.session.commit()

    return spotipy.Spotify(auth=token_info['access_token'])


def process_all_users():
    with app.app_context():
        users = User.query.all()
        if not users:
            print("No users in database yet.")
            return

        print(f"--- Starting Batch Update for {len(users)} users ---")

        for user in users:
            try:
                # 1. Get Authenticated Client
                sp = get_auth_client(user)

                # 2. Run your original logic
                run_update_for_user(sp, user.spotify_id)

            except Exception as e:
                print(f"CRITICAL ERROR processing user {user.spotify_id}: {e}")
                # You might want to add logic here: if error is "invalid_grant", remove user from DB.


if __name__ == "__main__":
    # Run loop
    while True:
        process_all_users()

        # Wait 4 hours before running again (14400 seconds)
        # You can change this to 1 hour or 24 hours depending on preference
        print("Sleeping for 4 hours...")
        time.sleep(14400)
