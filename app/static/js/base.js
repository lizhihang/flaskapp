/*
       自定义jquery函数，完成将form 数据转换为 json格式
*/
$.fn.serializeJson=function(){
        var serializeObj={};
        var array=this.serializeArray();
        // var str=this.serialize();
        $(array).each(function(){ // 遍历数组的每个元素
                if(serializeObj[this.name]){ // 判断对象中是否已经存在 name，如果存在name
                      if($.isArray(serializeObj[this.name])){
                             serializeObj[this.name].push(this.value); // 追加一个值 hobby : ['音乐','体育']
                      }else{
                              // 将元素变为 数组 ，hobby : ['音乐','体育']
                              serializeObj[this.name]=[serializeObj[this.name],this.value];
                      }
                }else{
                        serializeObj[this.name]=this.value; // 如果元素name不存在，添加一个属性 name:value
                }
        });
        return serializeObj;
};


function isEmail(strEmail) {

    if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)

        return true;

    else

        return false;

}


function initSummernote(){
    $('#summernote').summernote({
        height: 300,                 // set editor height
        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor
        focus: true,                // set focus to editable area after initializing summernote
        lang:'zh-CN',               //语言变为中文
        callbacks:{      //本文的主题来了，调用官方提供的callbacks接口，用来自定义
            onImageUpload: function(files) {      //onImageUpload代表图片上传事件，默认将图片变为base64的那个事件
                var data=new FormData();        //html5提供的formdata对象，将图片加载为数据的容器
                data.append('image_up',files[0]);  //加载选中的第一张图片，并给这图片数据标记一个'image_up'的名称
                //调用上传图片
                $.ajax({
                    url: '/upload_image',     //上传图片请求的路径
                    method: 'POST',            //方法
                    data:data,                 //数据
                    processData: false,        //告诉jQuery不要加工数据
                    contentType: false,        //<code class="javascript comments"> 告诉jQuery,在request head里不要设置Content-Type
                    success: function(data) {  //图片上传成功之后，对返回来的数据要做的事情
                        if (data['message']=='success') {
                            $("#summernote").summernote('insertImage',data['url']);       //调用内部api——insertImage以路径的形式插入图片到文本编辑区
                        }
                        else{
                            alert(data['message']);
                        }
                    }
                });
            }
        }
    });
}