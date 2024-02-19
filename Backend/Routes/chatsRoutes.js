const { fn, Sequelize, col, Op } = require('sequelize');
const Message = require('../Models/chatModel')
const User = require('../Models/userModel');
const Group = require('../Models/Group');
const Member = require('../Models/Member');

module.exports = (io, socket) => {
    const addMessage = async (data, cb) => {
        const groupId = data.groupId;
        const message = data.chat;
        const group = await Group.findByPk(groupId)
        // console.log(group);
        console.log(socket.user, 'socketid');
        const user = await group.getUsers({ where: { id: socket.user.id } })
        console.log(user, 'user');
        const member = user[0].member
        console.log(member, 'member');
        const result = await member.createChat({
            chat: message, groupId
        })
        socket.to(data.groupId).emit('message:recieve-message', data.chat, socket.user.name)

        cb()
    }
    socket.on('join-room', async (groupId, cb) => {
        const group = await Group.findByPk(groupId);

        const user = await group.getUsers({
            where: {
                id: socket.user.id
            }
        })
        const member = user[0].member;

        const chats = await group.getChats();
        const users = await group.getUsers({
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt', 'email', 'phoneNumber']
            }
        })

        await cb(chats, member.id, users)
    })
    socket.on('message:send-message', addMessage);
    socket.on('file:send-file-data', (data, groupId) => {
        socket.to(groupId).emit('file:recieve-file', data, socket.user.name)
    })
}