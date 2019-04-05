// WebRTC 信令服务器
// 2019/4/3
// lxq@weetgo.com

// WebSocket:> npm install -g ws

// 测试工具: > npm install -g wscat
// 测试命令：> wscat -c ws://localhost:8899

const WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;

var wss = new WebSocketServer({port: 8899});
// 存放连接用户.
var users = {};

wss.on("listening", function() {
    console.log("信令服务器启动......");
});

wss.on("connection", function(conn) {
    console.log("有用户连接.");

    conn.on("message", function(msg) {
        var data;
        try {
            data = JSON.parse(msg);
        } catch (e) {
            console.log("非JSON格式数据.");
            data = {};
        }

        switch(data.type) {
            case "login":
                login(conn, users, data);
                break;
            case "offer":
                offer(conn, users, data);
                break;
            case "answer":
                answer(conn, users, data);
                break;
            case "candidate":
                candidate(users, data);
                break;
            case "leave":
                leave(users, data);
                break;
            default:
                {
                    sendTo(conn, {
                        type: "error",
                        msg: "无效指令：" + data.type
                    });
                }
                break;
        }
    });

    // 用户断开连接.
    conn.on("close", function(msg) {
        if (conn.name) {
            delete users[conn.name];
            if (conn.other_name) {
                console.log("用户断开：", conn.other_name);
                var cur_conn = users[conn.other_name];
                cur_conn.other_name = null;
                if (null != cur_conn) {
                    sendTo(cur_conn, {type: "leave"});
                }
            }
        }
    });

    conn.send("你好， WebSocket.");
});

function sendTo(conn, msg) {
    conn.send(JSON.stringify(msg));
}

function login(conn, users, data) {
    console.log("用户登录：", data.name);
    if (users[data.name]) {
        sendTo(conn, {
            type: "login",
            success: false
        });
    } else {
        users[data.name] = conn;
        conn.name = data.name;
        sendTo(conn, {
            type: "login",
            success: true
        });
    }    
}

function offer(conn, users, data) {
    console.log("发送offer给用户：", data.name);
    var cur_conn = users[data.name];
    if (null != cur_conn) {
        conn.other_name = data.name;
        sendTo(cur_conn, {
            type: "offer",
            offer: data.offer,
            name: conn.name
        });
    }
}

function answer(conn, users, data) {
    console.log("给用户发送answer: ", data.name);
    var cur_conn = users[data.name];
    if (null != cur_conn) {
        conn.other_name = data.name;
        sendTo(cur_conn, {type: "answer", answer: data.answer});
    }
}

// ICE中连接已建立.
// candidate = offer + answer
function candidate(users, data) {
    console.log("给用户发送ICE候选路径：", data.name);
    var conn = users[data.name];
    if (null != conn) {
        sendTo(conn, {
            type: "candidate",
            candidate: data.candidate
        });
    }
}

function leave(users, data) {
    console.log("用户断开连接：", data.name);
    var conn = users[data.name];
    conn.other_name = null;
    if (null != conn) {
        sendTo(conn, {type: "leave"});
    }
}