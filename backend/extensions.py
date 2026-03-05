from flask_sqlalchemy import SQLAlchemy

# Single shared SQLAlchemy instance imported by both app.py and models.py
# This prevents circular imports
db = SQLAlchemy()
