const { Server } = require('socket.io');
const cors = require('cors')



const io=require('socket.io')(8000,{
    cors:{
        origin:"*"
    }
})






const users={}

io.on('connection',socket=>{

    socket.on('new-user-joined',name=>{

        // console.log(socket.id);
        users[socket.id]=name;
        io.sockets.emit('add-entry',users)
        socket.broadcast.emit('user-joined',{name : name,map: users}) //socket.broadcast jisne event kia, uske alava sabko emit karega 
    })

    socket.on('send',(msg,type)=>{
        console.log(type,msg)
        socket.broadcast.emit('recieve',{message: msg,
        name: users[socket.id],
        type: type
    })
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('left',`${users[socket.id]} has left`)
        delete users[socket.id];
        io.sockets.emit('add-entry',users)
    })


})





