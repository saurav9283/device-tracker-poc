const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const server = http.createServer(app);
app.use(express.static('public'));
const io = socketio(server);

app.set('view engine', 'ejs');
app.set(express.static(path.join(__dirname, 'public'))); 

io.on("connection" , function(socket)
{
    console.log("connected")
    socket.on("send-location" , function(data){
        // console.log(data);
        io.emit("recive-location" , {id: socket.id , ...data});
    });

    socket.on("disconnect" , function(){
        io.emit("user-disconnected" , socket.id);
    });
})

app.get("/" , function(req, res){
    res.render("index");
});

server.listen(3000);