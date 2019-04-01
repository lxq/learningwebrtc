// main.js
// 2019/4/1
// 《Learning WebRTC》

function getUserMedia() {
    return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

usermedia = getUserMedia();
if (!!usermedia) {
    navigator.getUserMedia = usermedia;

    navigator.getUserMedia(
        {video: true, audio: true},
        function(stream) {
            var v = document.querySelector("video");
            v.src = window.URL.createObjectURL(stream);
        },
        function (err) {}
    );
} else {
    alert("浏览器不支持 getUserMedia!");
}
