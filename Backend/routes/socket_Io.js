const { fn, Sequelize, col, Op } = require('sequelize');
const Group = require('../models/group')

module.exports = (io, socket) => {
    const addMessage = async (data, cb) => {
        const groupId = data.groupId;
        const message = data.message;
        const group = await Group.findByPk(groupId)
        const user = await group.getUsers({ where: { id: socket.user.id } })

        const member = user[0].member

        await member.createMessage({
            messages: message, groupId
        })

        socket.to(data.groupId).emit('message:recieve-message', data.message, socket.user.name)
        cb()
    };

    socket.on('join-room', async (groupId, cb) => {

        const group = await Group.findByPk(groupId);
        const user = await group.getUsers({
            where: {
                id: socket.user.id
            }
        })

        const member = user[0].member;

        const messages = await group.getMessages();
        const users = await group.getUsers({
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt', 'email', 'phoneNumber']
            }
        })

        await cb(messages, member.id, users)
    })

    socket.on('message:send-message', addMessage);
    
    socket.on('file:send-file-data', (data, groupId) => {
        socket.to(groupId).emit('file:recieve-file', data, socket.user.name)
    })
}