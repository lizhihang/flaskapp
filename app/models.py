# -*- coding: utf-8 -*-
#from sqlalchemy import Column, Integer, String

from datetime import *
from app import db
import uuid


class User(db.Model):
    __tablename__ = 'user'


    id = db.Column(db.String(50), default=lambda:str(uuid.uuid1()).replace('-',''), primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    admin = db.Column(db.Boolean, default=0)
    create_time = db.Column(db.DateTime)
    last_update_time = db.Column(db.DateTime)

    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.create_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.last_update_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    def __repr__(self):
        return '<User %r %r>' % (self.email, self.password)

    def user2dict(self):
        return {
            'user_id': self.id,
            'email': self.email,
            'password': self.password,
            'create_time': str(self.create_time)
        }

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
            return str(self.id)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.last_update_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Blog(db.Model):
    __tablename__ = 'blog'


    id = db.Column(db.String(50), default=lambda:str(uuid.uuid1()).replace('-',''), primary_key=True)
    title = db.Column(db.String(150), unique=True, nullable=False)
    brief = db.Column(db.String(255))
    content = db.Column(db.Text)
    create_time = db.Column(db.DateTime)
    last_update_time = db.Column(db.DateTime)

    def __init__(self,title,brief,content):
        self.title = title
        self.brief = brief
        self.content = content
        self.create_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.last_update_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    def __repr__(self):
        return '<Blog %r>' % self.title

    def blog2dict(self):
        return {
            'blog_id': self.id,
            'title': self.title,
            'brief': self.brief,
            'content': self.content,
            'create_time': str(self.create_time)
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.last_update_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Comment(db.Model):
    __tablename__ = 'comment'


    id = db.Column(db.String(50), default=lambda:str(uuid.uuid1()).replace('-',''), primary_key=True)
    content = db.Column(db.Text)
    user_id = db.Column(db.String(50), nullable=False)
    blog_id = db.Column(db.String(50), nullable=False)
    create_time = db.Column(db.DateTime)
    last_update_time = db.Column(db.DateTime)

    def __init__(self,content,user_id,blog_id):
        self.content = content
        self.blog_id = blog_id
        self.user_id = user_id
        self.create_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.last_update_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    def __repr__(self):
        return '<Comment %r>' % self.content

    def comment2dict(self):
        return {
            'comment_id': self.id,
            'content': self.content,
            'user_id': self.user_id,
            'blog_id': self.blog_id,
            'create_time': str(self.create_time)
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.last_update_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
