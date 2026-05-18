const htmlChatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const availableRoomsList = document.getElementById('available-rooms');
const privateModeCheckbox = document.getElementById('private-mode-checkbox');
const privateRecipientDisplay = document.getElementById('private-recipient-display');

// Get Username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

let selectedPrivateUser = null;
let selectedPrivateUserRoom = null;
let currentUsername = username;
let allUsersList = [];

const my_socket = io();

// Join chatroom
my_socket.emit("JoinRoom", { username, room });

// Get room and users
my_socket.on("RoomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Get available rooms
my_socket.on("AvailableRooms", (rooms) => {
  outputAvailableRooms(rooms);
});

// Get all users from all rooms
my_socket.on("AllUsers", (users) => {
  allUsersList = users;
  outputAllUsers(users);
});

// Message from server (room message)
my_socket.on("Message", message => {
  outPutMessage(message, false);
});

// Private message received
my_socket.on("PrivateMessage", (message) => {
  if (message.isSent) {
    outPutMessage({
      username: `📨 Private to ${message.to} (${message.toRoom})`,
      text: message.text,
      time: message.time
    }, true);
  } else {
    outPutMessage({
      username: `🔒 Private from ${message.from} (${message.fromRoom})`,
      text: message.text,
      time: message.time
    }, true);
  }
});

// Error message
my_socket.on("ErrorMessage", (error) => {
  alert(error);
});

// Scroll down
chatMessages.scrollTop = chatMessages.scrollHeight;

// Add event listener when Message submit
htmlChatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = e.target.elements.message_bord.value;

  if (!message.trim()) return;

  if (privateModeCheckbox.checked && selectedPrivateUser) {
    // Send private message
    my_socket.emit("PrivateMessage", {
      toUser: selectedPrivateUser,
      message: message
    });
  } else {
    // Send room message
    my_socket.emit("ChatMessage", message);
  }

  // Clear input
  e.target.elements.message_bord.value = '';
  e.target.elements.message_bord.focus();
});

// Output Message to DOM 
function outPutMessage(message, isPrivate = false) {
  const div = document.createElement('div');
  div.classList.add('message');
  if (isPrivate) {
    div.classList.add('private-message');
  }

  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerHTML = room;
}

// Add users to DOM (current room only)
function outputUsers(users) {
  userList.innerHTML = users.map(user =>
    `<li class="user-item" data-username="${user.username}" data-room="${roomName.innerHTML}" style="cursor: pointer; padding: 5px; margin: 2px 0;">
      <i class="fas fa-user"></i> ${user.username}
      ${user.username === currentUsername ? '<span class="private-badge">You</span>' : ''}
     </li>`
  ).join('');

  // Add click handler to users for private messaging
  attachUserClickHandlers();
}

// Display all users from all rooms
function outputAllUsers(users) {
  // Group users by room
  const usersByRoom = {};
  users.forEach(user => {
    if (!usersByRoom[user.room]) {
      usersByRoom[user.room] = [];
    }
    usersByRoom[user.room].push(user);
  });

  // Create a separate section for all users
  let allUsersHtml = '<h4 style="margin-top: 15px; color: #fff;"><i class="fas fa-users"></i> All Online Users</h4>';

  for (const [roomName, roomUsers] of Object.entries(usersByRoom)) {
    allUsersHtml += `<div style="margin-left: 10px; margin-top: 10px;">
      <strong style="color: #ffd700; font-size: 12px;">📍 ${roomName}</strong>
      <ul style="margin-top: 5px;">`;

    roomUsers.forEach(user => {
      allUsersHtml += `<li class="all-user-item" data-username="${user.username}" data-room="${user.room}" style="cursor: pointer; padding: 5px; margin: 2px 0; list-style: none;">
        <i class="fas fa-user-circle"></i> ${user.username}
        ${user.username === currentUsername ? '<span class="private-badge" style="background-color: #28a745;">You</span>' : ''}
        ${user.room !== roomName.innerHTML ? '<span class="room-info">(Different room)</span>' : ''}
      </li>`;
    });

    allUsersHtml += `</ul></div>`;
  }

  // Add to sidebar
  const existingSection = document.getElementById('all-users-section');
  if (existingSection) {
    existingSection.innerHTML = allUsersHtml;
  } else {
    const allUsersSection = document.createElement('div');
    allUsersSection.id = 'all-users-section';
    allUsersSection.innerHTML = allUsersHtml;
    document.querySelector('.chat-sidebar').appendChild(allUsersSection);
  }

  // Attach click handlers to all users
  attachAllUserClickHandlers();
}

// Attach click handlers for current room users
function attachUserClickHandlers() {
  document.querySelectorAll('.user-item').forEach(item => {
    const username = item.getAttribute('data-username');
    if (username !== currentUsername) {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        setPrivateRecipient(username, roomName.innerHTML);
      });
    }
  });
}

// Attach click handlers for all users (cross-room)
function attachAllUserClickHandlers() {
  document.querySelectorAll('.all-user-item').forEach(item => {
    const username = item.getAttribute('data-username');
    const userRoom = item.getAttribute('data-room');
    if (username !== currentUsername) {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        setPrivateRecipient(username, userRoom);
      });

      // Add hover effect
      item.style.transition = 'background-color 0.3s';
      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = '#3a3a3a';
      });
      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = '';
      });
    }
  });
}

// Display available rooms
function outputAvailableRooms(rooms) {
  if (!availableRoomsList) return;

  if (rooms.length === 0) {
    availableRoomsList.innerHTML = '<li>No active rooms</li>';
    return;
  }

  availableRoomsList.innerHTML = rooms.map(room =>
    `<li style="padding: 5px; margin: 2px 0;">
      <i class="fas fa-door-open"></i> <strong>${room.name}</strong> 
      <span style="color: #ffd700;">(${room.userCount} user${room.userCount !== 1 ? 's' : ''})</span>
     </li>`
  ).join('');
}

// Set private message recipient
function setPrivateRecipient(username, userRoom) {
  selectedPrivateUser = username;
  selectedPrivateUserRoom = userRoom;
  privateModeCheckbox.checked = true;

  const currentUserRoom = roomName.innerHTML;
  const roomIndicator = userRoom !== currentUserRoom ? ` (Different Room: ${userRoom})` : '';

  privateRecipientDisplay.innerHTML = `Sending private message to: <strong>${username}</strong>${roomIndicator}`;

  // Add visual feedback
  setTimeout(() => {
    privateRecipientDisplay.style.opacity = '1';
  }, 100);
}

// Handle private mode checkbox changes
if (privateModeCheckbox) {
  privateModeCheckbox.addEventListener('change', (e) => {
    if (!e.target.checked) {
      selectedPrivateUser = null;
      selectedPrivateUserRoom = null;
      privateRecipientDisplay.innerHTML = '';
    } else if (!selectedPrivateUser) {
      privateRecipientDisplay.innerHTML = 'Click on any user (from any room) to send private message';
    }
  });
}

// Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  }
});