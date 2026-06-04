const assert = require('assert');
const { userJoin, getCurrentUser, userLeaveChat, getRoomUsers, getAllUsers, getRoomList } = require('../utls/users');
const messageFormater = require('../utls/messages');

console.log('Running tests...');

try {
    // Test messageFormater
    const msg = messageFormater('Alice', 'Hello World');
    assert.strictEqual(msg.username, 'Alice');
    assert.strictEqual(msg.text, 'Hello World');
    assert.ok(msg.time);
    console.log('✓ messageFormater test passed');

    // Test userJoin
    const user = userJoin('123', 'Bob', 'Room 1');
    assert.strictEqual(user.id, '123');
    assert.strictEqual(user.username, 'Bob');
    assert.strictEqual(user.room, 'Room 1');
    console.log('✓ userJoin test passed');

    // Test getCurrentUser
    const foundUser = getCurrentUser('123');
    assert.deepStrictEqual(foundUser, user);
    console.log('✓ getCurrentUser test passed');

    // Test getRoomUsers
    const roomUsers = getRoomUsers('Room 1');
    assert.strictEqual(roomUsers.length, 1);
    assert.deepStrictEqual(roomUsers[0], user);
    console.log('✓ getRoomUsers test passed');

    // Test getRoomList
    const rooms = getRoomList();
    assert.strictEqual(rooms.length, 1);
    assert.strictEqual(rooms[0].name, 'Room 1');
    assert.strictEqual(rooms[0].userCount, 1);
    console.log('✓ getRoomList test passed');

    // Test userLeaveChat
    const leftUser = userLeaveChat('123');
    assert.deepStrictEqual(leftUser, user);
    assert.strictEqual(getCurrentUser('123'), undefined);
    console.log('✓ userLeaveChat test passed');

    console.log('\x1b[32m%s\x1b[0m', '✓ All tests passed successfully!');
    process.exit(0);
} catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '✗ Test failed:');
    console.error(error);
    process.exit(1);
}
