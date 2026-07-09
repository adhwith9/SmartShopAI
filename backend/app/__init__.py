import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

from .models import db
from .routes import api
from .seed import seed_data


def create_app():
    load_dotenv()
    static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend_dist"))
    app = Flask(__name__, static_folder=static_dir if os.path.isdir(static_dir) else None, static_url_path="")
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
    app.config["JWT_SECRET"] = os.getenv("JWT_SECRET", "dev-jwt-secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///smartshop.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    app.register_blueprint(api, url_prefix="/api")

    if app.static_folder:
        @app.get("/")
        def serve_frontend():
            return send_from_directory(app.static_folder, "index.html")

        @app.get("/<path:path>")
        def serve_spa(path):
            candidate = os.path.join(app.static_folder, path)
            if os.path.isfile(candidate):
                return send_from_directory(app.static_folder, path)
            return send_from_directory(app.static_folder, "index.html")

    with app.app_context():
        db.create_all()
        seed_data()

    return app
