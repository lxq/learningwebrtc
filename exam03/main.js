// peer.js
// 2019/4/2
// 《Learning WebRTC》
// RTCPeerConnection 练习.

// 采用StreamMedia API重写.
// @date 2019/4/11
// @description 两个Peer通信直接在一个网页中进行连接，其中的Server由浏览器自动模拟.
//              在Edge中测试通过。
//              在Firefox中无法正确运行，提示：RTCIceServer.url is deprecated! Use urls instead.  onaddstream is deprecated! Use peerConnection.ontrack instead.
//              Chrome中运行正确，但无法显示另一个Video。
(function(){
    var video_me = null, video_you = null;
    var peer_me = null, peer_you = null;

    function startup() {
        video_me = document.getElementById("yours");
        video_you = document.getElementById("theirs");

        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then(function(stream) {
                video_me.srcObject = stream;
                start_peer(stream);
            })
            .catch(function(err) {
                alert("获取媒体流失败：" + err);
            });
    }

    function start_peer(stream) {
        var cfg = {
            "iceServers":[{"url": "stun:127.0.0.1:9678"}]
        };
        peer_me = new RTCPeerConnection(cfg);
        peer_you = new RTCPeerConnection(cfg);

        // listen stream
        peer_me.addStream(stream);
        peer_you.onaddstream = function(obj) {
            video_you.srcObject = obj.stream;
        };

        // ICE
        peer_me.onicecandidate = function(e) {
            if (e.candidate) {
                peer_you.addIceCandidate(new RTCIceCandidate(e.candidate));
            }
        };
        peer_you.onicecandidate = function(e) {
            if (e.candidate) {
                peer_me.addIceCandidate(new RTCIceCandidate(e.candidate));
            }
        };

        // offer
        peer_me.createOffer(function(offer) {
            peer_me.setLocalDescription(new RTCSessionDescription(offer));
            peer_you.setRemoteDescription(new RTCSessionDescription(offer));

            peer_you.createAnswer(function(offer) {
                peer_you.setLocalDescription(new RTCSessionDescription(offer));
                peer_me.setRemoteDescription(new RTCSessionDescription(offer));
            });
        });
    }

    window.addEventListener("load", startup, false);
    
})();



// function startPeer(stream) {
//     var cfg = {
//         "iceServers":[{"url": "stun:127.0.0.1:9678"}]
//     };
//     yc = new RTCPeerConnection(cfg);
//     tc = new RTCPeerConnection(cfg);

//     // 监听流
//     yc.addStream(stream);
//     tc.onaddstream = function(e) {
//         tv.src = window.URL.createObjectURL(e.stream);
//     };

//     // ICE
//     yc.onicecandidate = function(e) {
//         if (e.candidate) {
//             tc.addIceCandidate(new RTCIceCandidate(e.candidate));
//         }
//     };
//     tc.onicecandidate = function(e) {
//         if (e.candidate) {
//             yc.addIceCandidate(new RTCIceCandidate(e.candidate));
//         }
//     };

//     // offer
//     yc.createOffer(function(offer){
//         yc.setLocalDescription(offer);
//         tc.setRemoteDescription(offer);

//         tc.createAnswer(function(offer){
//             tc.setLocalDescription(offer);
//             yc.setRemoteDescription(offer);
//         });
//     });

// }