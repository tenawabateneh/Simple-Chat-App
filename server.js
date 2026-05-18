const path = require('path');
const http = require('http');
const socketIO = require('socket.io')
const express = require('express');
const messageFormater = require('./utls/messages');
const { userJoin, getCurrentUser, userLeaveChat, getRoomUsers, getAllUsers, getRoomList } = require('./utls/users')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

var chatAdmin = "Ethio Chat Admin";
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run WHEN the client connects
io.on("connection", mySocket => {

    // Listen for JoinRoom
    mySocket.on("JoinRoom", ({ username, room }) => {
        const user = userJoin(mySocket.id, username, room);

        mySocket.join(user.room);   // Join that user to a specific room

        // Welcome message to current user
        mySocket.emit("Message", messageFormater(chatAdmin, "Welcome to Chatting!"));

        // Broadcast to a specfic room when the user connects
        mySocket.broadcast.to(user.room).emit("Message", messageFormater(chatAdmin, ` ${user.username} has joined the chat!`));

        // Send users and room info
        io.to(user.room).emit("RoomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        // Send all available rooms to the user
        mySocket.emit("AvailableRooms", getRoomList());

        // Send all users from all rooms (for cross-room private messaging)
        mySocket.emit("AllUsers", getAllUsers());
    });

    // Listen for private message
    mySocket.on("PrivateMessage", ({ toUser, message }) => {
        const sender = getCurrentUser(mySocket.id);
        const recipient = getAllUsers().find(user => user.username === toUser);

        if (recipient) {
            // Send to recipient
            io.to(recipient.id).emit("PrivateMessage", {
                from: sender.username,
                fromRoom: sender.room,
                text: message,
                time: messageFormater(sender.username, message).time,
                isPrivate: true
            });

            // Send confirmation to sender
            mySocket.emit("PrivateMessage", {
                from: "You",
                to: recipient.username,
                toRoom: recipient.room,
                text: message,
                time: messageFormater(sender.username, message).time,
                isPrivate: true,
                isSent: true
            });
        } else {
            mySocket.emit("ErrorMessage", "User not found or offline");
        }
    });

    // Listen for ChatMessage (room message)
    mySocket.on("ChatMessage", chat_message => {
        const user = getCurrentUser(mySocket.id);
        io.to(user.room).emit("Message", messageFormater(user.username, chat_message));
    });

    // Run when client disconnects
    mySocket.on("disconnect", () => {
        // Remove user from the chatlist
        const user = userLeaveChat(mySocket.id);
        if (user) {
            // Broadcast to everyone
            io.to(user.room).emit("Message", messageFormater(chatAdmin, `${user.username} has left the chat!`));

            // Send users and room info
            io.to(user.room).emit("RoomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            });

            // Update available rooms for all users
            io.emit("AvailableRooms", getRoomList());

            // Update all users list for all connected clients
            io.emit("AllUsers", getAllUsers());
        }
    });
});

const PORT = 8000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));