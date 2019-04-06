// WebRTC 静态服务器.
// 2019/4/5
// lxq@weetgo.com

/**
 * 测试方法：
 * 进入本目录
 * 启动信令服务：> node signal.js
 * 启动静态服务：> static
 * 浏览器访问index.html
 */


var user_name;
var conn_user;

// 特别说明：这里不能使用“localhost"——会存在WebSocket跨域问题;
// 原因是：static服务器默认是启动的 127.0.0.1:8080
var ws = new WebSocket("ws://127.0.0.1:8899");

ws.onopen = function() {
    console.log("已连接.");
};

ws.onmessage = function(msg){
    console.log("收到信息: ", msg.data);

    try {
        var data = JSON.parse(msg.data);
        switch(data.type) {
            case "login":
                onLogin(data.success);
                break;
            case "offer":
                onOffer(data.offer, data.name);
                break;
            case "answer":
                onAnswer(data.answer);
                break;
            case "leave":
                onLeave();
                break;
            default:
                break;
        }    
    } catch (err) {
        console.log("数据没有JSON内容，无法解析.");
    }    
};

ws.onerror = function(err){
    console.log("错误信息：", err);
};

function send(msg) {
    if (conn_user) {
        msg.name = conn_user;
    }

    ws.send(JSON.stringify(msg));
}



var div_login = document.querySelector("#div_login");
var input_username = document.querySelector("#user_name");
var btn_login = document.querySelector("#btn_login");
var div_rtc = document.querySelector("#div_rtc");
var input_other = document.querySelector("#user_another");
var btn_call = document.querySelector("#btn_call");
var btn_hangup = document.querySelector("#btn_hangup");
div_rtc.style.display = "none";

var yvideo = document.querySelector("#yours");
var tvideo = document.querySelector("#theirs");

var peer_conn, cur_user, stream;

btn_login.addEventListener("click", function(e) {
    var name = input_username.value;
    if (name.length > 0) {
        send({type: "login", name: name});
    }
});

btn_call.addEventListener("click", function(e) {
    var name = input_other.value;
    if (name.length > 0) {
        start_peer(name);
    }
});

btn_hangup.addEventListener("click", function(e) {
    send({type: "leave"});
    onLeave();
});


function onLogin(flag) {
    if (flag) {
        div_login.style.display = "none";
        div_rtc.style.display = "block";       
        // start connection
        start_conn(); 
    } else {
        alert("登录失败，请重试其他用户名.");
    }
}

function onOffer(offer, name) {
    conn_user = name;
    peer_conn.setRemoteDescription(new RTCTSessionDescription(offer));
    peer_conn.createAnswer(function(answer) {
        peer_conn.setLocalDescription(answer);
        send({type: "answer", answer: answer});
    }, function (err) {
        alert("创建answer失败.");
    });
}

function onAnswer(answer) {
    peer_conn.setRemoteDescription(new RTCSessionDescription(answer));
}

function onCandidate(candidate) {
    peer_conn.addIceCandidate(new RTCIceCandidate(candidate));
}

function onLeave() {
    conn_user = null;
    yvideo.src = null;
    peer_conn.close();
    peer_conn.onicecandidate = null;
    peer_conn.onaddstream = null;
    setup_peer(stream);
}


function getUserMedia() {
    return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function hasPeerConn() {
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    return !!(window.RTCPeerConnection);
}

function start_conn() {
    var usermedia = getUserMedia();
    navigator.getUserMedia = usermedia;
    if (!!usermedia) {
        var cons = {video: true, audio: false};
        navigator.getUserMedia(cons, function(mystream) {
            stream = mystream;
            yvideo.src = window.URL.createObjectURL(stream);
            if (hasPeerConn()) {
                setup_peer(stream);
            } else {
                alert("浏览器不支持WebRTC.");
            }
        }, function (err) {
            console.log(err);
        });
    } else {
        alert("浏览器不支持WebRTC");
    }
}

function setup_peer(stream) {
    // peer connection
    var cfg = {
        "iceServers":[{"url": "stun:127.0.0.1:8899"}]
    };
    peer_conn = new RTCPeerConnection(cfg);
    peer_conn.addStream(stream);
    peer_conn.onaddstream = function(e) {
        tvideo.src = window.URL.createObjectURL(e.stream);
    };

    // ICE
    peer_conn.oncandidate = function (e) {
        if (e.candidate) {
            send({type: "candidate", candidate: e.candidate});
        }
    };
}

function start_peer(name) {
    conn_user = name;

    // offer
    peer_conn.createOffer(function(offer) {
        send({type: "offer", offer: offer});
        peer_conn.setLocalDescription(offer);
    }, function(err) {
        alert("Offer 发生错误.");
    });
}
