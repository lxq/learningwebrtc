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
        console.log("收到消息：", msg);
    });

    conn.send("你好， WebSocket.");
});

