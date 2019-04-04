// WebRTC 信令服务器
// 2019/4/3
// lxq@weetgo.com

console.log("信令服务器启动......");

// WebSocket:> npm install -g ws

// 测试工具: > npm install -g wscat
// 测试命令：> wscat -c ws://localhost:8899

const WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;

var wss = new WebSocketServer({port: 8899});
// 存放连接用户.
var users = {};

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
                {
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
        }
    });

    conn.send("你好， WebSocket.");
});

function sendTo(conn, msg) {
    conn.send(JSON.stringify(msg));
}

