// peer.js
// 2019/4/2
// 《Learning WebRTC》
// RTCPeerConnection 练习.

function getUserMedia() {
    return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function hasPeerConn() {
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    return !!(window.RTCPeerConnection);
}

var yv = document.querySelector("#yours");
var tv = document.querySelector("#theirs");

var yc, tc;

var usermedia = getUserMedia();
if (!!usermedia) {
    navigator.getUserMedia = usermedia;
    
    var cons = {
        audio: false,
        video: true
    }

    navigator.getUserMedia(
        cons,
        // 正确的回调.
        // @param stream 当前设备上能产生数据流的媒体设备.
        function(stream) {
            yv.src = window.URL.createObjectURL(stream);
            if (hasPeerConn()) {
                startPeer(stream);
            } else {
                console.log("浏览器不支持 RTCPeerConnection!");
            }
        },
        // 错误回调.
        function (err) {
            console.log("获取媒体设备错误：", err);
        }
    );

} else {
    alert("浏览器不支持 webRTC!");
}

function startPeer(stream) {
    var cfg = {
        "iceServers":[{"url": "stun:127.0.0.1:9678"}]
    };
    yc = new RTCPeerConnection(cfg);
    tc = new RTCPeerConnection(cfg);

    // ICE
    yc.onicecandidate = function(e) {
        if (e.candidate) {
            tc.addIceCandidate(new RTCIceCandidate(e.candidate));
        }
    };
    tc.onicecandidate = function(e) {
        if (e.candidate) {
            yc.addIceCandidate(new RTCIceCandidate(e.candidate));
        }
    };

    // offer
    yc.createOffer(function(offer){
        yc.setLocalDescription(offer);
        tc.setRemoteDescription(offer);

        tc.createAnswer(function(offer){
            tc.setLocalDescription(offer);
            yc.setRemoteDescription(offer);
        });
    });

    // 监听流
    yc.addStream(stream);
    tc.onaddstream = function(e) {
        tv.src = window.URL.createObjectURL(e.stream);
    };
}