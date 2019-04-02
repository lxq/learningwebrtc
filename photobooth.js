// photobooth.js
// 2019/4/2
// 《Learning WebRTC》

function getUserMedia() {
    return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

usermedia = getUserMedia();
if (!!usermedia) {
    navigator.getUserMedia = usermedia;
    
    var cons = {
        audio: false,
        video: true
    }

    var video = document.querySelector("video");
    var canvas = document.querySelector("canvas");
    var streaming = false;

    navigator.getUserMedia(
        cons,
        // 正确的回调.
        // @param stream 当前设备上能产生数据流的媒体设备.
        function(stream) {
            video.src = window.URL.createObjectURL(stream);
            streaming = true;
        },
        // 错误回调.
        function (err) {
            console.log("获取媒体设备错误：", err);
        }
    );

    var filters = ["", "grayscale", "sepia", "invert"];
    var cur = 0;
    document.querySelector("#capture").addEventListener("click", function(e) {
        if (streaming) {
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0);

            cur++;
            if (cur > filters.length - 1) cur = 0;
            canvas.className = filters[cur];
        }
    });
} else {
    alert("浏览器不支持 getUserMedia!");
}
