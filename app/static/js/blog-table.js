$(document).ready(function(){
    initSummernote();
    show_blog_table();

});

//<tr>
//    <td></td>
//    <td></td>
//    <td><button onclick="showEditDiv(this)"></td>
//    <td><button onclick="showDeleteDiv(this)"></td>
//</tr>

function showEditDiv(obj){
    var blogId = $(obj).parent().prev().prev().text();
    console.log(blogId)

    $.ajax({
        type: "GET",
        url: '/blog/' + blogId,
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: '',
        success: function(result) {
        //                data:响应信息
            var jsonObj = result.data;
            if(result.code == 200){
                $("#blogId").val(jsonObj.blog_id);
                $("#blogTitle").val(jsonObj.title);
                $("#blogBrief").val(jsonObj.brief);
                $("#summernote").summernote("code",jsonObj.content);
            }else{
                alert("Get blog list error.");
            }

        },
        error: function(dataError) {
        //                dataError错误信息
            console.log("错误是" + dataError.status);
        }
    });

}

function editBlog(){
    var param = $("#blogEditForm").serializeJson();
    var blogContent = $('#summernote').summernote('code');

    param['content'] = blogContent;

    console.log(param)
    $.ajax({
        type: "PUT",
        url: '/blog/' + param["blogId"],
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: JSON.stringify(param),
        success: function(result) {
//                data:响应信息
            console.log(result.code)

            if(result.code == 200){
                location.href = '/blogtable/';
//                alert('Edit success.');

            }else{
                alert("Error. Try again.");
            }

        },
        error: function(dataError) {
//                dataError错误信息
            console.log("错误是" + dataError.status);
        }
    });
}


function showDeleteDiv(obj){
    var blogId = $(obj).parent().prev().prev().prev().text();
    console.log(blogId)
    $("#blogId2Del").val(blogId);
}

function deleteBlog(){
    var param = $("#blogDeleteForm").serializeJson();

    $.ajax({
        type: "DELETE",
        url: '/blog/' + param["blogId"],
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: JSON.stringify(param),
        success: function(result) {
//                data:响应信息
            console.log(result.code)

            if(result.code == 200){
                location.href = '/blogtable/';
//                alert('Delete success.');

            }else{
                alert("Error. Try again.");
            }

        },
        error: function(dataError) {
//                dataError错误信息
            console.log("错误是" + dataError.status);
        }
    });
}


function show_blog_table(){
    $.ajax({
        type: "GET",
        url: '/blog/',
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: '',
        success: function(result) {
        //                data:响应信息
            var list = result.data;
            if(result.code == 200){
                $.each( list, function( key, jsonObj ) {
                    show_one_blog(jsonObj);
                });
            }else{
                alert("Get blog list error.");
            }

        },
        error: function(dataError) {
        //                dataError错误信息
            console.log("错误是" + dataError.status);
        }
    });
}

function show_one_blog(obj){
    var $tr = $("<tr></tr>");
    var $editModelButton = $("<button>").attr("type","button")
                                       .attr("class","btn btn-info")
                                       .attr("data-toggle","modal")
                                       .attr("data-target","#blogEditModal")
                                       .attr("onclick","showEditDiv(this)")
                                       .append($("<i>").attr("class","fa fa-edit"));
    var $deleteModelButton = $("<button>").attr("type","button")
                                          .attr("class","btn btn-danger")
                                          .attr("data-toggle","modal")
                                          .attr("data-target","#blogDeleteModal")
                                          .attr("onclick","showDeleteDiv(this)")
                                          .append($("<i>").attr("class","fa fa-trash-o"))
    $tr = $tr.append($("<td>").attr("style","overflow:hidden;text-overflow:ellipsis;").append(obj.blog_id))
             .append($("<td>").attr("style","overflow:hidden;text-overflow:ellipsis;").append(obj.title))
             .append($("<td>").append($editModelButton).append($deleteModelButton));

    $("#blogTable tbody").append($tr);
}