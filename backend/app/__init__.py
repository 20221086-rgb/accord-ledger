from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from app.config import Config

db = SQLAlchemy()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    CORS(
        app,
        origins=app.config["CORS_ORIGINS"],
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "OPTIONS"],
    )

    from app.routes.auth import auth_bp
    from app.routes.records import records_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(records_bp, url_prefix="/api/records")

    with app.app_context():
        from app.models import Perspective, Record, User  # noqa: F401

        db.create_all()

    @app.get("/api/health")
    def health():
        return {"status": "ok", "service": "accord-ledger"}

    return app
