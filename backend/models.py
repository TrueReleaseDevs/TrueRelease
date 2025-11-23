from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    spotify_id = db.Column(db.String(150), unique=True, nullable=False)
    # Stores the token allowing us to access their account offline
    refresh_token = db.Column(db.String(500), nullable=False)

    def __repr__(self):
        return f'<User {self.spotify_id}>'
