# -*- coding: utf-8 -*-
import os, sys

class Config(object):
    DEBUG = False




class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:root@localhost/pythonflaskweb?charset=utf8'


class DevelopmentConfig(Config):
    DEBUG = True

    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:root@localhost/pythonflaskweb?charset=utf8'

    #如果设置为 Ture ， SQLAlchemy 会记录所有 发给 stderr 的语句，这对调试有用。
    SQLALCHEMY_ECHO = False

    #一个映射binds到连接URI的字典
    #SQLALCHEMY_BINDS

    #可以用于显式地禁用或启用查询记录。查询记录 在调试或测试模式自动启用
    #SQLALCHEMY_RECORD_QUERIES

    #可以用于显式禁用原生 unicode 支持
    #SQLALCHEMY_NATIVE_UNICODE

    #数据库连接池的大小。默认是引擎默认值（通常 是 5 ）
    SQLALCHEMY_POOL_SIZE = 5

    #设定连接池的连接超时时间。默认是 10
    SQLALCHEMY_POOL_TIMEOUT = 10

    #多少秒后自动回收连接。这对 MySQL 是必要的， 它默认移除闲置多于 8 小时的连接。
    # 注意如果 使用了 MySQL ， Flask-SQLALchemy 自动设定 这个值为 2 小时。
    SQLALCHEMY_POOL_RECYCLE = 2

    #如果设置成True(默认情况)，Flask - SQLAlchemy
    #将会追踪对象的修改并且发送信号。这需要额外的内存， 如果不必要的可以禁用它
    SQLALCHEMY_TRACK_MODIFICATIONS = True

    SECRET_KEY = 'test1'

    # 配置图片上传路径：./static/images/
    UPLOAD_FOLDER = sys.path[0]+os.sep+'app'+os.sep+"static"+os.sep+'images'

