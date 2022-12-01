
const socket = io("http://localhost:3000"); 
// thông báo đăng ký thất bại
socket.on("server-send-fail",function(){
    alert("Tên đã được dùng hoặc không hợp lệ, vui lòng chọn tên khác");
});
// Nhận danh sách người dki và đưa vào box
socket.on("server-send-listUsers", function(data){
    $("#chatlist").append("<div socketID='" + data.id + "' class='block'> <p>"+ data.username + "</p>" + "<span>Đang họat động</span>" + "</div>");
    });

// Chuyển từ trang login sang chat
socket.on("server-send-connect",function(data){
    $("#currentUser").html(data);
    $("#login").hide(500);
    $("#chat").show(500);
});

//Người nhận
socket.on("server-send-msg-forIdUser", function(data){
    $("#chatBox").append("<div class='message'>" + "<div id='userSend'>" + data.un + "</div>" + "<span id='friend_message'>" + data.ct + "</span>" + "</div>" );
});

//Người gửi
socket.on("server-send-msg-forUser", function(data){
    $("#chatBox").append("<div class='message mymsg'>" + "<span id='my_message'>" + data.ct + "</div>" );
});


$(document).ready(function(){
    $("#login").show(500);
    $("#chat").hide(500);

    $("#btnLogin").click(function(){
        socket.emit("client-send-Username",$("#txtUsername").val());
    });
    $("#btnLogout").click(function(){
        socket.emit("logout");
        $("#login").show(500);
        $("#chat").hide(500);
    });
    $(document).on("click", ".block", function(){
        const content = $("#chat_input").val();
        const id = $(this).attr("socketID");
        socket.emit("client-send-IdUser-msg",{ Id: id, Content: content });
        $("#chat_input").val("");
    });
    // $("#btnSend").click(function(){
    //     const content = $("#txtMess").val();
    //     socket.emit("user-send-mess", content);
    //     $("#txtMess").val("");
    // });
});
