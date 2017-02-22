var currentUrl = window.location.href;
var currentUrlSplit = currentUrl.split("/");
var blogId = currentUrlSplit[currentUrlSplit.length-1];
console.log(blogId + " , " + userId);

$(document).ready(function(){
    get_blog_detail();
    get_comment_list();

    $("#postCommentButton").click(function() {
        postComment();
    });
});

function postComment(){
    var param = $("#commentForm").serializeJson();
    param['user_id'] = userId;
    param['blog_id'] = blogId;
    $.ajax({
        type: "POST",
        url: '/comment/',
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: JSON.stringify(param),
        success: function(result) {
    //                data:响应信息
            if(result.code == 200){
                location.reload();
            }

        },
        error: function(dataError) {
    //                dataError错误信息
            console.log("错误是" + dataError.status);
        }
    });
}

function get_blog_detail(){

    $.ajax({
        type: "GET",
        url: '/blog/' + blogId,
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: '',
        success: function(result) {
    //                data:响应信息
            var jsonObj = result.data;
            show_blog_detail(jsonObj);

        },
        error: function(dataError) {
    //                dataError错误信息
            console.log("错误是" + dataError.status);
        }
    });

}


function show_blog_detail(obj){

    var $blogTitle = $("<h1>").append(obj.title);
    var $blogAuthor = $("<p>").attr("class","lead")
                              .append("By")
                              .append($("<a>").attr("href","#").append(" Lzh"));
    var $postTime = $("<p>").append($("<span>").attr("class","glyphicon glyphicon-time"))
                            .append("Posted on " + obj.create_time);
    var $blogBrief = $("<p>").attr("class","lead").text(obj.brief);
    var $blogContent = obj.content;


    $("#blogDetail").append($blogTitle).append($blogAuthor).append("<hr>")
                    .append($postTime).append("<hr>")
                    .append($blogBrief).append($blogContent).append("<hr>");

}

function get_comment_list(){

    $.ajax({
        type: "GET",
        url: '/comment/?blogId=' + blogId,
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: '',
        success: function(result) {
    //                data:响应信息
            var list = result.data;

            $.each( list, function( key, jsonObj ) {
                show_one_comment(jsonObj);
            });

        },
        error: function(dataError) {
    //                dataError错误信息
            console.log("错误是" + dataError.status);
        }
    });

}

function show_one_comment(obj){

    var $commentUserAndTime = $("<h4>").attr("class","media-heading")
                                       .append(obj.user_email)
                                       .append($("<small>").append(" " + obj.create_time));
    var $mediaDiv = $("<div>").attr("class","media")
                              .append($("<div>").attr("class","media-body")
                                                .append($commentUserAndTime)
                                                .append(obj.content));

    $("#commentList").append($mediaDiv);
}



