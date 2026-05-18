const moment = require('moment'); // for formatting the time

// function to format the message object
function messageFormater(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = messageFormater;