$(document).ready(function() {

    initSummernote();
    $("#postBlog").click(function() {
        postBlog();
    });

});

function resetForm(){
    $("input").val('');
    $("textarea").val('');
    $('#summernote').summernote('code','');

}

function postBlog(){
    var param = $("#blogForm").serializeJson();
    var blogContent = $('#summernote').summernote('code');

    param['content'] = blogContent;

    console.log(param)
     $.ajax({
        type: "POST",
        url: '/blog/',
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: JSON.stringify(param),
        success: function(result) {
//                data:响应信息
            console.log(result.code)
            resetForm();
            if(result.code == 200){

                alert('Post success.');

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

