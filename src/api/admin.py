import os
import inspect
from flask_admin import Admin
from . import models
from .models import db
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='4Geeks Admin',
                  theme=Bootstrap4Theme(swatch='cerulean'))
    jwt = JWTManager(app)
    # Dynamically add all models to the admin interface
    for name, obj in inspect.getmembers(models):
        # Verify that the object is a SQLAlchemy model before adding it to the admin.
        if inspect.isclass(obj) and issubclass(obj, db.Model):
            admin.add_view(ModelView(obj, db.session))
