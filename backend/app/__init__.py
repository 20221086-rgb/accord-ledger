from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from app.config import Config

db = SQLAlchemy()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)

    cors_origins = app.config["CORS_ORIGINS"]
    CORS(
        app,
        resources={
            r"/api/*": {"origins": cors_origins},
            # Legacy/wrong base URL without /api prefix (VITE_API_URL = host only)
            r"/auth/*": {"origins": cors_origins},
            r"/records/*": {"origins": cors_origins},
        },
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        expose_headers=["Content-Type"],
    )

    from app.routes.auth import auth_bp
    from app.routes.records import records_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(records_bp, url_prefix="/api/records")
    # Compat: requests to /auth/* when frontend omits /api in API base URL
    app.register_blueprint(auth_bp, url_prefix="/auth", name="auth_compat")
    app.register_blueprint(records_bp, url_prefix="/records", name="records_compat")

    with app.app_context():
        from app.models import Perspective, Record, User  # noqa: F401

        db.create_all()

    @app.get("/api/health")
    def health():
        return {"status": "ok", "service": "accord-ledger"}

    return app
