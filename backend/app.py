import time
import pymysql
from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db
from routes import api  # import Blueprint


def create_app():
    """Application factory — creates and configures the Flask app."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Allow requests from the React frontend (running on port 3000)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Bind SQLAlchemy to this app
    db.init_app(app)

    # Register all /api/* routes
    app.register_blueprint(api)

    return app


def wait_for_db(app, retries=10, delay=5):
    """
    Wait until MySQL is ready before starting the Flask server.
    Docker Compose starts containers in parallel so MySQL may not be ready
    when the backend starts — we retry a few times before giving up.
    """
    cfg = app.config
    for attempt in range(1, retries + 1):
        try:
            conn = pymysql.connect(
                host     = cfg["MYSQL_HOST"] if "MYSQL_HOST" in cfg else "mysql",
                port     = int(cfg.get("MYSQL_PORT", 3306)),
                user     = cfg["MYSQL_USER"] if "MYSQL_USER" in cfg else "deployuser",
                password = cfg["MYSQL_PASSWORD"] if "MYSQL_PASSWORD" in cfg else "deploypass",
                database = cfg["MYSQL_DB"] if "MYSQL_DB" in cfg else "deployboard",
            )
            conn.close()
            print(f"[DB] Connected to MySQL on attempt {attempt}")
            return True
        except Exception as e:
            print(f"[DB] Attempt {attempt}/{retries} failed: {e}. Retrying in {delay}s …")
            time.sleep(delay)
    raise RuntimeError("Could not connect to MySQL after multiple retries.")


if __name__ == "__main__":
    app = create_app()

    # Block until MySQL accepts connections
    wait_for_db(app)

    with app.app_context():
        # Create tables if they don't exist yet (idempotent)
        db.create_all()
        print("[DB] Tables verified / created.")

    app.run(host="0.0.0.0", port=5000, debug=True)
