const express = require("express");
const { Server } = require("http");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

const server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(3000);

const mangUsers=[];

io.on("connection", function(socket){
    console.log("Đã có người kết nối với ID: (" + socket.id + ")");

   
    socket.on("client-send-Username", function(data){
         // Nhận dữ liệu sau đó kiểm tra đã có tên trong mảng chưa
        if(mangUsers.indexOf(data)>=0){
            socket.emit("server-send-fail", data)
        }else {
            mangUsers.push(data);
            socket.Username = data;
            socket.emit("server-send-connect",data);
            // Gui du lieu den tat ca moi nguoi
            io.sockets.emit("server-send-listUsers", {username: data, id: socket.id});
        }
    });
    socket.on("logout", function(){
        mangUsers.splice(
            mangUsers.indexOf(socket.Username, 1)
        );
        socket.broadcast.emit("server-send-listUsers",mangUsers);
    });
    socket.on("client-send-IdUser-msg", function(data){
        socket.emit("server-send-msg-forUser", {un: socket.Username, ct: data.Content});
        console.log(data.Id, data.Content);
        io.to(data.Id).emit("server-send-msg-forIdUser", {un: socket.Username, ct: data.Content});
    });
});

app.get("/", function(req, res){
    res.render("trangchu");
});


