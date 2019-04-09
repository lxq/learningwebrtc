// main.js
// 2019/4/1
// 《Learning WebRTC》

// function getUserMedia() {
//     return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
// }

// usermedia = getUserMedia();
// if (!!usermedia) {
//     navigator.getUserMedia = usermedia;

//     // 音视频约束选项.
//     // var cons = {
//     //     // video: true,
//     //     video: {
//     //         mandatory: {
//     //             minAspectRatio: 1.777,
//     //             maxAspectRatio: 1778
//     //         },
//     //         optional: {
//     //            maxWidth:1024,maxHeight:768
//     //         }
//     //     },
//     //     audio: false//避免本机“音频反馈”.
//     // };
//     var cons = {
//         audio: false,
//         // 指定视频宽高.
//         video: {width: 1024, height: 768}
//     }

//     navigator.getUserMedia(
//         cons,
//         // 正确的回调.
//         // @param stream 当前设备上能产生数据流的媒体设备.
//         function(stream) {
//             var v = document.querySelector("video");
//             v.srcObject = stream;
//             // v.src = window.URL.createObjectURL(stream);
//         },
//         // 错误回调.
//         function (err) {}
//     );
// } else {
//     alert("浏览器不支持 getUserMedia!");
// }

// 采用StreamMedia API进行重写。
// @date 2019/4/10 00:00

// 采用匿名函数，避免变量全局污染.
(function() {   
    var video = null;
    function startup() {
        var media_cons = {video:true, audio:false};
        video = document.getElementById("video");

        // media stream
        navigator.mediaDevices.getUserMedia(media_cons)
            .then(function(stream) {
                video.srcObject = stream;
            })
            .catch(function(err){
                alert("获取媒体流失败："+err);
            });
    }

    // start up
    window.addEventListener("load", startup, false);

})();
