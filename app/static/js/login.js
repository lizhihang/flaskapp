$(document).ready(function(){
    $("#register").click(function() {
        register();
    });

    $("#login").click(function() {
        login();
    });
});

function register(){



    var param = $("#userForm").serializeJson();
    console.log(param["email"])
    if(!isEmail(param["email"])){

        $("#isEmail").attr("class","form-group has-error");
        $("#isEmail").append($("<p></p>").attr("class","help-block").append(" input invalid email"));
        return;
    }
    console.log(param)
     $.ajax({
        type: "POST",
        url: '/registered/',
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: JSON.stringify(param),
        success: function(result) {
//                data:响应信息
            if(result.code == 200){
                location.href = '/index';
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

function login(){


    var param = $("#userForm").serializeJson();
    console.log(param["email"])
    if(!isEmail(param["email"])){

        $("#isEmail").attr("class","form-group has-error");
        $("#isEmail").append($("<p></p>").attr("class","help-block").append(" input invalid email"));
        return;
    }
    console.log(param)
     $.ajax({
        type: "POST",
        url: '/login/',
        contentType: 'application/json;charset=utf-8',
        dataType: "json",
        data: JSON.stringify(param),
        success: function(result) {
//                data:响应信息
            console.log(result.code)
            if(result.code == 200){
                location.href = '/index';
            }else if(result.code == 403){
                alert("Login error.")
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



