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
    });

    conn.send("你好， WebSocket.");
});

function sendTo(conn, msg) {
    conn.send(JSON.stringify(msg));
}

