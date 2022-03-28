const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    addUser,
    getUsers,
    getNoOfUsers,
    getCurrentUser,
    userLeave
    
} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
    socket.on('joinChatting', ({ username })=>{
        // add User into users array
        addUser(socket.id, username);

        socket.emit('profileDisplay', username);

        users = getUsers();

        // add User into Display
        io.emit('addUsersDisplay', users);
    });

    socket.on('findNoOfUsers',()=>{
        socket.emit('knowNoOfUsers',getNoOfUsers());
    });

    socket.on('getUsers',(noOfUsers)=>{
        socket.emit('knowUsersList', getUsers(),noOfUsers);
    });

    socket.on('broadcast',(msg)=>{
        let user = getCurrentUser(socket.id);
        socket.broadcast.emit('message', formatMessage(user.username,msg));
    });

    socket.on('unicast',(recipients,msg)=>{
        let user = getCurrentUser(socket.id);
        
        recipients.forEach((recipient)=>{
            socket.broadcast.to(recipient).emit('message', formatMessage(user.username,msg));
        });
    });

    socket.on('test',(text)=>{
        console.log("test");
        console.log(text);
    });

    socket.on('disconnect',()=>{
        userLeave(socket.id);
        socket.broadcast.emit('addUsersDisplay', getUsers());
    }); 
});

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

server.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}/`));