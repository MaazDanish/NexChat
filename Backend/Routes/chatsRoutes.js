const { fn, Sequelize, col, Op } = require('sequelize');
const Message = require('../Models/chatModel')
const User = require('../Models/userModel');
const Group = require('../Models/Group');
const Member = require('../Models/Member');

module.exports = (io, socket) => {
    const addMessage = async (data, cb) => {
        console.log('add message')
        console.log(data)

        const groupId = data.groupId;

        const message = data.chat;

        const group = await Group.findByPk(groupId)
        // console.log(group);
        console.log(socket.user, 'socketid');

        const user = await group.getUsers({ where: { id: socket.user.id } })
        console.log(user,'user');
        const member = user[0].member
        console.log(member,'member');


        const result = await member.createChat({
            chat: message, groupId
        })
        socket.to(data.groupId).emit('message:recieve-message', data.chat, socket.user.name)
        // console.log(socket.user,'testung after reciing message',data.chat,socket.user.name)
        cb()
    }

    socket.on('join-room', (groupId) => {
        socket.join(groupId)

    })
    socket.on('message:send-message', addMessage)
}