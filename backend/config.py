import os

class Config:
    # Database connection — reads from environment variables set in docker-compose.yml
    # Falls back to localhost defaults for running outside Docker
    MYSQL_HOST     = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT     = int(os.getenv("MYSQL_PORT", 3306))
    MYSQL_USER     = os.getenv("MYSQL_USER", "deployuser")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "deploypass")
    MYSQL_DB       = os.getenv("MYSQL_DB", "deployboard")

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}"
        f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    )
    # Disable modification tracking (saves memory, not needed here)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Secret key used by Flask for session signing
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-change-in-prod")
