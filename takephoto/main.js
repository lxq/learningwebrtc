// WebRTC拍照练习
// https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Taking_still_photos
// @src: https://github.com/mdn/samples-server/tree/master/s/webrtc-capturestill
// @author: Allen
// @email: linxq@live.com
// @date: 2019/4/9

// 将整个脚本包装在匿名函数中，以避免使用全局变量.
(function(){
    var width = 320, height = 0;
    var streaming = false;

    var video = null;
    var canvas = null;
    var btn_start = null;
    var photo = null;


    function startup() {
        video = document.getElementById("video");
        canvas = document.getElementById("canvas");
        photo = document.getElementById("photo");
        btn_start = document.getElementById("btn_start");

        // 获取媒体流
        navigator.mediaDevices.getUserMedia({video:true, audio: false})
            .then(function(stream){
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                alert("获取设备媒体错误: ", err);
            });

        /*
        在<video>上调用HTMLMediaElement.play（）之后，在视频流开始流动之前，有一段（希望简短）的时间段过去了。 
        为了避免阻塞，直到发生这种情况，我们为视频播放，即视频播放实际开始时传送的视频添加事件侦听器。 
        此时，视频对象中的所有属性都已基于流的格式进行配置。
        */
        video.addEventListener("canplay", function(e) {
            if(!streaming) {
                height = video.videoHeight /(video.videoWidth/width);
                if (isNaN(height)) {
                    height = width/(4/3);
                }

                video.setAttribute("width", width);
                video.setAttribute("height", height);
                canvas.setAttribute("width", width);
                canvas.setAttribute("height", height);
                streaming = true;
            }
        }, false);

        btn_start.addEventListener("click", function(e){
            takePic();
            e.preventDefault();
        }, false);

        clean();
    }

    function clean() {
        // getContext() 必须是小写，大写的不行。
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#AAA";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL("img/png");
        photo.setAttribute("src", data);
    }

    function takePic() {
        var ctx = canvas.getContext("2d");
        if (width && height) {
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(video, 0, 0, width, height);
            var data = canvas.toDataURL("img/png");
            photo.setAttribute("src", data);
        } else {
            clean();
        }
    }

    // start up
    window.addEventListener("load", startup, false);
})();