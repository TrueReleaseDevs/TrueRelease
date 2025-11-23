import os
from flask import Flask, request, redirect, session, render_template
from flask_cors import CORS
from spotipy.oauth2 import SpotifyOAuth
from models import db, User
from dotenv import load_dotenv
import spotipy

load_dotenv()

print("--- DEBUG INFO ---")
client_id = os.getenv("SPOTIPY_CLIENT_ID")
if client_id:
    print(f"Client ID loaded: {client_id[:5]}... (Length: {len(client_id)})")
else:
    print("ERROR: Client ID is None")

client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
if client_secret:
    print(f"Client Secret loaded: {client_secret[:5]}... (Length: {len(client_secret)})")
else:
    print("ERROR: Client Secret is None")

redirect_uri = os.getenv("SPOTIPY_REDIRECT_URI")
print(f"Redirect URI: {redirect_uri}")
print("------------------")

app = Flask(__name__)
CORS(app, origins=["https://spotifyv21.netlify.app"], supports_credentials=True)
app.secret_key = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create Database on startup
with app.app_context():
    db.create_all()


def create_spotify_oauth(show_dialog=False):
    return SpotifyOAuth(
        client_id=os.getenv("SPOTIPY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
        scope="playlist-modify-private playlist-modify-public playlist-read-private user-follow-read",
        show_dialog=show_dialog,
        cache_path=".spotify_cache"
    )


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login')
def login():
    # Check if we want to force re-login (show dialog)
    show_dialog = request.args.get('show_dialog') == 'true'
    sp_oauth = create_spotify_oauth(show_dialog=show_dialog)
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)


@app.route('/callback')
def callback():
    sp_oauth = create_spotify_oauth()
    code = request.args.get('code')

    # Exchange code for tokens
    token_info = sp_oauth.get_access_token(code)

    if not token_info:
        # CHANGED: Send error back to JS
        return redirect('/?status=error')

    # Get User ID and Name
    sp = spotipy.Spotify(auth=token_info['access_token'])
    user_profile = sp.current_user()
    spotify_id = user_profile['id']
    display_name = user_profile.get('display_name')

    if not display_name:
        display_name = spotify_id if spotify_id else 'User'

    print(f"DEBUG: Login successful for user_id: {spotify_id}")
    print(f"DEBUG: Retrieved display_name: {display_name}")

    # Save to DB
    existing_user = User.query.filter_by(spotify_id=spotify_id).first()

    if not existing_user:
        new_user = User(spotify_id=spotify_id,
                        refresh_token=token_info['refresh_token'])
        db.session.add(new_user)
    else:
        existing_user.refresh_token = token_info['refresh_token']

    db.session.commit()

    # CHANGED: Redirect to home with success flag for JS to pick up
    # For production, redirect to Netlify deployment
    import urllib.parse
    encoded_name = urllib.parse.quote(display_name)
    return redirect(f'https://spotifyv21.netlify.app/?status=success&name={encoded_name}')


@app.route('/run_update', methods=['POST'])
def run_update():
    data = request.json
    exclude_covers = data.get('exclude_covers', False)
    exclude_remixes = data.get('exclude_remixes', False)

    # In a real app, you'd get the user from the session or token
    # For now, we'll re-create the oauth object to get the token,
    # but ideally we should persist the token or user session.
    # However, since we are storing tokens in DB, let's try to get the current user.
    # For simplicity in this specific flow without full session management implemented yet:
    # We will assume the user just logged in and we can get the token from cache or similar if available,
    # OR we rely on the fact that `sp_oauth.get_cached_token()` might work if on the same machine.

    # BETTER APPROACH for this context:
    # The user is "logged in" on the frontend, but the backend is stateless here.
    # We need to know WHICH user is asking.
    # For this specific task, let's assume single user or get the cached token if possible.

    sp_oauth = create_spotify_oauth()
    token_info = sp_oauth.get_cached_token()

    if not token_info:
        return {"status": "error", "message": "Not authenticated"}, 401

    sp = spotipy.Spotify(auth=token_info['access_token'])
    user_profile = sp.current_user()
    current_user_id = user_profile['id']

    from spotify_logic import run_update_for_user
    try:
        success = run_update_for_user(sp, current_user_id, exclude_covers, exclude_remixes)
        return {"status": "success", "message": "Playlist updated!"}
    except Exception as e:
        print(f"Error running update: {e}")
        return {"status": "error", "message": str(e)}, 500


if __name__ == '__main__':
    if not os.getenv("SPOTIPY_CLIENT_ID"):
        print("ERROR: SPOTIPY_CLIENT_ID not found in .env")
    else:
        app.run(debug=True, port=5000)
