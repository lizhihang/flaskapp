# -*- coding: utf-8 -*-
from flask import Flask
from conf import config
from flask_sqlalchemy import SQLAlchemy
from flask_login import login_manager, login_required, logout_user, login_user, current_user
import flask_login

app = Flask(__name__)
app.config.from_object(config.DevelopmentConfig)

db = SQLAlchemy(app)

login_manager = flask_login.LoginManager(app)
login_manager.login_view = 'login_page'


from app.models import User, Blog, Comment

from app import views

