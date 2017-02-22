# -*- coding: utf-8 -*-
from flask import request, g
from werkzeug.exceptions import abort
import os, sys
import functools

from app import app, User, Blog, Comment, db, login_manager, login_required, logout_user, login_user, current_user
from flask import render_template, jsonify, redirect, url_for


'''验证是否是admin'''
def admin_required(func):
    @functools.wraps(func)
    def wrapper(*args, **kw):
        app.logger.debug(current_user.admin)
        if not current_user.admin:
            return redirect(url_for('login_page'))
        return func(*args, **kw)
    return wrapper



@app.route('/')
@app.route('/index/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/detail/<blog_id>', methods=['GET','POST'])
def detail_page(blog_id=None):
    app.logger.debug(blog_id)
    return render_template('detail.html')


@app.route('/userlogin/', methods=['GET','POST'])
def login_page():

    return render_template('login.html')

@app.route("/login/", methods=["POST"])
def login():

    if not request.json:
        abort(500)  # bad request
    if not 'email' in request.json:
        abort(500)  # bad request
    if not 'password' in request.json:
        abort(500)  # bad request
    email = request.json.get('email')
    password = request.json.get('password')
    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        return jsonify({'code':403})

    app.logger.debug(user)
    login_user(user)

    return jsonify({'code':200})


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect('/index')
    # return render_template('index.html')

@app.route('/registered/', methods=['POST'])
def registered():

    if not request.json:
        abort(500)  # bad request
    if not 'email' in request.json:
        abort(500)  # bad request
    if not 'password' in request.json:
        abort(500)  # bad request
    email = request.json.get('email')
    password = request.json.get('password')
    u = User(email=email,password=password)

    u.save()

    return jsonify({'code':200})




@app.route('/admin/', methods=['GET'])
@login_required
@admin_required
def admin_page():
    return render_template('admin.html')


@app.route('/postblog/', methods=['GET'])
@login_required
@admin_required
def post_blog_page():
    return render_template('post_blog.html')


@app.route('/blogtable/', methods=['GET'])
@login_required
@admin_required
def blog_table_page():
    return render_template('blog_table.html')


@app.route('/commenttable/', methods=['GET'])
@login_required
@admin_required
def comment_table_page():
    return render_template('comment_table.html')


@app.route('/blog/', methods=['GET'])
def get_blog_list():
    blog = Blog.query.order_by(Blog.create_time.desc()).all()
    app.logger.debug(blog)
    blog_list = []
    for b in blog:
        # data = json.dumps(b, default=Blog.blog2dict)
        data = Blog.blog2dict(b)
        app.logger.debug(data)
        blog_list.append(data)
    app.logger.debug(blog_list)
    return jsonify({
            'code':200,
            'data':blog_list
        })

@app.route('/blog/<blog_id>', methods=['GET'])
def get_one_blog(blog_id=None):
    app.logger.debug(blog_id)
    b = Blog.query.filter_by(id=blog_id).first()
    blog = Blog.blog2dict(b)

    return jsonify({
            'code':200,
            'data':blog
        })


@app.route('/blog/<blog_id>', methods=['PUT'])
@login_required
@admin_required
def update_blog(blog_id=None):
    if not request.json:
        abort(400)
    if not 'blogId' in request.json:
        abort(400)

    b = Blog.query.filter_by(id=blog_id).first()
    if 'title' in request.json:
        b.title = request.json.get('title')
    if 'brief' in request.json:
        b.brief = request.json.get('brief')
    if 'content' in request.json:
        b.content = request.json.get('content')
    b.update()

    return jsonify({'code':200})


@app.route('/blog/<blog_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_blog(blog_id=None):
    if not request.json:
        abort(400)
    app.logger.debug(blog_id)
    b = Blog.query.filter_by(id=blog_id).first()
    b.delete()
    return jsonify({'code':200})

@app.route('/blog/', methods=['POST'])
@login_required
@admin_required
def create_blog(blog_id=None):
    if not request.json:
        abort(400)
    if not 'title' in request.json:
        abort(400)
    if not 'brief' in request.json:
        abort(400)
    if not 'content' in request.json:
        abort(400)

    title = request.json.get('title')
    brief = request.json.get('brief')
    content = request.json.get('content')
    app.logger.debug(title)
    b = Blog(title=title,brief=brief,content=content)
    b.save()
    return jsonify({'code':200})




@app.route('/comment/', methods=['GET'])
def get_comment_list():
    if not request.args:
        abort(400)
    blog_id = request.args.get('blogId')
    if blog_id == str('showallcomment'):
        comment = Comment.query.order_by(Comment.create_time.asc()).all()
    else:
        comment = Comment.query.filter_by(blog_id=blog_id).order_by(Comment.create_time.asc()).all()
    comment_list = []
    for c in comment:
        # data = json.dumps(b, default=Blog.blog2dict)
        data = Comment.comment2dict(c)
        user = User.query.filter_by(id=data['user_id']).first()
        data['user_email'] = user.email;
        data.pop('user_id')

        app.logger.debug(data)
        comment_list.append(data)
    app.logger.debug(comment_list)
    return jsonify({
        'code':200,
        'data':comment_list
    })

@app.route('/comment/<comment_id>', methods=['GET'])
@login_required
@admin_required
def get_one_comment(comment_id=None):
    c = Comment.query.filter_by(id=comment_id).first()
    comment = Comment.comment2dict(c)
    return jsonify({
        'code':200,
        'data':comment
    })


@app.route('/comment/<comment_id>', methods=['PUT'])
@login_required
@admin_required
def update_comment(comment_id=None):
    if not request.json:
        abort(400)
    if not 'commentId' in request.json:
        abort(400)

    comment = Comment.query.filter_by(id=comment_id).first()
    if 'content' in request.json:
        comment.content = request.json.get('content')

    comment.update()

    return jsonify({'code':200})

@app.route('/comment/<comment_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_comment(comment_id=None):
    if not request.json:
        abort(400)

    c = Comment.query.filter_by(id=comment_id).first()
    c.delete()
    return jsonify({'code':200})

@app.route('/comment/', methods=['POST'])
@login_required
def create_comment():
    if not request.json:
        abort(400)
    if not 'content' in request.json:
        abort(400)
    if not 'user_id' in request.json:
        abort(400)
    if not 'blog_id' in request.json:
        abort(400)

    content = request.json.get('content')
    user_id = request.json.get('user_id')
    blog_id = request.json.get('blog_id')
    c = Comment(content=content,user_id=user_id,blog_id=blog_id)
    c.save()
    return jsonify({'code':200})


@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404


@app.errorhandler(403)
def page_forbidden(error):
    return render_template('403.html'), 403


@app.errorhandler(500)
def internal_server_error(error):
    return render_template('500.html'), 500

@app.errorhandler(400)
def bad_request(error):
    return render_template('400.html'), 400

@login_manager.user_loader
def load_user(id):
    return User.query.filter_by(id=id).first()


#上传文件路由：/upload_image
@app.route('/upload_image',methods=['POST'])
@login_required
@admin_required
def upload_img():
    if 'image_up' not in request.files:     #没有发现图片数据
        return jsonify(message='没发现要上传的图片')
    file_metas=request.files['image_up']
    filename=file_metas.filename    #获取图片名称
    app.logger.debug(sys.path)
    app.logger.debug(app.config['UPLOAD_FOLDER'])
    file_metas.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))    #存储图片到服务器
    return jsonify(message='success',url='../static/images/{0}'.format(filename))  #返回服务器该图片的相对路径数据，用以前端处理（插入图片连接到编辑区域)


