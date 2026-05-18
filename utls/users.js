const users = [];

// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

// Getting the current user
function getCurrentUser(id) {
    return users.find(usr => usr.id === id);
}

// Get all users
function getAllUsers() {
    return users;
}

// Get user by username
function getUserByUsername(username) {
    return users.find(usr => usr.username === username);
}

// User leaves chat
function userLeaveChat(id) {
    const index = users.findIndex(usr => usr.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Getting room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

// Get list of all rooms with user count
function getRoomList() {
    const rooms = {};
    users.forEach(user => {
        if (!rooms[user.room]) {
            rooms[user.room] = {
                name: user.room,
                userCount: 0,
                users: []
            };
        }
        rooms[user.room].userCount++;
        rooms[user.room].users.push(user.username);
    });
    return Object.values(rooms);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeaveChat,
    getRoomUsers,
    getAllUsers,
    getUserByUsername,
    getRoomList
};