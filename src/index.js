const express=require('express');
const path=require('path');
const http=require('http');
const socketio=require('socket.io');
const Filter=require('bad-words');
const { generatemsg, generatelocation  }=require('./utils/messages.js');
const { adduser,removeuser,getuser,getUsersInRoom}=require('./utils/users.js');
const app=express();
const server = http.createServer(app);
const io=socketio(server);

const port=process.env.PORT || 3000;

//Define path fir express configuration
const hpath=path.join(__dirname,'../public');

app.use(express.static(hpath));
let count =0;
io.on('connection',(socket)=>{
 
 console.log('new web socket connection');
 
  socket.on('join',({username,room},callback)=>{
        const {error,user}=adduser({id:socket.id,username,room})
        if(error)
        {
            return callback(error);
        }
      socket.join(user.room);
      socket.emit('message', generatemsg('Admin','Welcome '+user.username));
      socket.broadcast.to(user.room).emit('message', generatemsg('Admin',user.username+' just hopped in!'))
      io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)})
      callback();
  })
    socket.on('sendmsg', (message,callback) => {
        const user=getuser(socket.id)
        const filter=new Filter();
        if(filter.isProfane(message))
        {
            return callback('Bad words not allowed')
        }
        io.to(user.room).emit('message',generatemsg(user.username, message)); 
        callback();
    })
    socket.on('sendlocation',(position,callback)=>{
        const user = getuser(socket.id)
        io.to(user.room).emit('locationlink', generatelocation(user.username,'https://google.com/maps?q='+position.lat+','+position.long))
        callback();
    })
 
    socket.on('disconnect',()=>{
        const user=removeuser(socket.id);
        if(user)
        {
            
            io.to(user.room).emit('message',generatemsg( 'Admin',user.username+' just left!')); 
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
        }
       
    })
    
})


server.listen(port, ()=>{
    console.log('Server active on port '+port);
})
