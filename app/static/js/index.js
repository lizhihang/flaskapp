$(document).ready(function(){
    show_blog_list();
});

function show_blog_list(){

     $.ajax({
            type: "GET",
            url: '/blog/',
            contentType: 'application/json;charset=utf-8',
            dataType: "json",
            data: '',
            success: function(result) {
//                data:响应信息
                var list = result.data;
                $.each( list, function( key, jsonObj ) {
                    show_one_blog(jsonObj);
                });

            },
            error: function(dataError) {
//                dataError错误信息
                console.log("错误是" + dataError.status);
            }
        });

}


function show_one_blog(obj){

    var $blogTitleUrl = $("<a>").attr("href","/detail/"+obj.blog_id).text(obj.title);
    var $blogTitle = $("<h2>").append($blogTitleUrl);
    var $postTime = $("<p>").append($("<span>").attr("class","glyphicon glyphicon-time"));
    $postTime = $postTime.append("Posted on " + obj.create_time)
    var $blogBrief = $("<p>").text(obj.brief)
    var $blogButtonUrl = $("<a>").attr("href","/detail/"+obj.blog_id).attr("class","btn btn-primary").text("Read More");

    $blogButtonUrl = $blogButtonUrl.append($("<span>").attr("class","glyphicon glyphicon-chevron-right"));
    $("#blogList").append($blogTitle).append($postTime).append("<hr>").append($blogBrief).append($blogButtonUrl).append("<hr>");

}