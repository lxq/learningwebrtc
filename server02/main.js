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
var conn = new WebSocket("ws://127.0.0.1:8899");

conn.onopen = function() {
    console.log("已连接.");
};

conn.onmessage = function(msg){
    console.log("收到信息: ", msg.data);

    try {
        var data = JSON.parse(msg.data);
        switch(data.type) {
            default:
                break;
        }    
    } catch (err) {
        console.log("数据没有JSON内容，无法解析.");
    }    
};

conn.onerror = function(err){
    console.log("错误信息：", err);
};

function send(msg) {
    if (conn_user) {
        msg.name = conn_user;
    }

    conn.send(JSON.stringify(msg));
}
