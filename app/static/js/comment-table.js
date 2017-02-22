$(document).ready(function(){

    show_comment_table();

});

//<tr>
//    <td></td>
//    <td></td>
//    <td></td>
//    <td><button onclick="showEditDiv(this)"></td>
//    <td><button onclick="showDeleteDiv(this)"></td>
//</tr>

function showEditDiv(obj){
    var commentId = $(obj).parent().prev().prev().prev().text();
    console.log(commentId)

    $.ajax({
        type: "GET",
        url: '/comment/' + commentId,
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: '',
        success: function(result) {
        //                data:响应信息
            var jsonObj = result.data;
            if(result.code == 200){
                $("#commentId").val(jsonObj.comment_id);
                $("#commentContent").val(jsonObj.content);

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

function editComment(){
    var param = $("#commentEditForm").serializeJson();

    console.log(param)
    $.ajax({
        type: "PUT",
        url: '/comment/' + param["commentId"],
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: JSON.stringify(param),
        success: function(result) {
//                data:响应信息
            console.log(result.code)

            if(result.code == 200){
                location.href = '/commenttable/';
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
    var commentId = $(obj).parent().prev().prev().prev().prev().text();
    console.log(commentId)
    $("#commentId2Del").val(commentId);
}

function deleteComment(){
    var param = $("#commentDeleteForm").serializeJson();

    $.ajax({
        type: "DELETE",
        url: '/comment/' + param["commentId"],
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: JSON.stringify(param),
        success: function(result) {
//                data:响应信息
            console.log(result.code)

            if(result.code == 200){
                location.href = '/commenttable/';
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


function show_comment_table(){
    $.ajax({
        type: "GET",
        url: '/comment/?blogId=showallcomment',
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: '',
        success: function(result) {
        //                data:响应信息
            var list = result.data;
            if(result.code == 200){
                $.each( list, function( key, jsonObj ) {
                    show_one_comment(jsonObj);
                });
            }else{
                alert("Get comment list error.");
            }

        },
        error: function(dataError) {
        //                dataError错误信息
            console.log("错误是" + dataError.status);
        }
    });
}

function show_one_comment(obj){
    var $tr = $("<tr></tr>");
    var $editModelButton = $("<button>").attr("type","button")
                                       .attr("class","btn btn-info")
                                       .attr("data-toggle","modal")
                                       .attr("data-target","#commentEditModal")
                                       .attr("onclick","showEditDiv(this)")
                                       .append($("<i>").attr("class","fa fa-edit"));
    var $deleteModelButton = $("<button>").attr("type","button")
                                          .attr("class","btn btn-danger")
                                          .attr("data-toggle","modal")
                                          .attr("data-target","#commentDeleteModal")
                                          .attr("onclick","showDeleteDiv(this)")
                                          .append($("<i>").attr("class","fa fa-trash-o"))
    $tr = $tr.append($("<td>").attr("style","overflow:hidden;text-overflow:ellipsis;").append(obj.comment_id))
             .append($("<td>").attr("style","overflow:hidden;text-overflow:ellipsis;").append(obj.user_email))
             .append($("<td>").attr("style","overflow:hidden;text-overflow:ellipsis;").append(obj.content))
             .append($("<td>").append($editModelButton).append($deleteModelButton));
             
    $("#commentTable tbody").append($tr);
}