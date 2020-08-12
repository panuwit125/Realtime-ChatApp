const express = require('express');
const socketio = require('socket.io');
const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=> {
    res.render('index');
})

app.get('/home',(req,res)=>{
    res.render('home');
})

const server = app.listen(process.env.PORT || 3000,()=>{
    console.log('server is running...');
})

//Initialize socket for the server
const io = socketio(server);

io.on('connection',(socket)=>{
    console.log('New user connected');
    socket.username = "Anonymous"

    socket.on('disconnect',()=>{
        console.log('user disconnected')
    })

    socket.on('change_username',data => {
        console.log('chang',data)
        socket.username = data.username
    })

    // handle the new message event
    socket.on('new_message', data => {
        console.log('new message',data);
        io.sockets.emit('receive_message', {message: data.message, username: socket.username})
    })

    socket.on('typing',data => {
        console.log('typing',data)
        socket.broadcast.emit('typing',{ username: socket.username })
    })

    /*setInterval(function(){
        var currentDate = new Date();
        io.sockets.emit('clock',{currentDate:currentDate})
    },[10000])*/
})