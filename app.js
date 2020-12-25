const express = require('express');
const socketio = require('socket.io');
const app = express();


app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=> {
    res.render('home');
})

app.get('/home',(req,res)=>{
    res.render('index');
})

const server = app.listen(process.env.PORT || 5000,()=>{
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

    socket.on('forceDisconnect', function(){
        console.log('forceDisconnect')
        socket.disconnect();
    });

    socket.on('open_thermascan',data => {
        console.log('open_thermascan',data)
        //socket.broadcast.emit('typing',{ username: socket.username })
        io.sockets.emit(data.card_reader, data.cid)
    })
})
