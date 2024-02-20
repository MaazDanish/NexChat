const Group = require('../models/group')
const Message = require('../models/message');
const Member = require('../models/member');
const { Sequelize } = require('sequelize');

exports.PostMessage = async (req, res, next) => {
    try {
        const { chat } = req.body;
        const userId = req.decoded_UserId.userId;
        const chats = await Message.create({
            messages: chat,
            userId: userId
        });

        res.status(200).json({ chat: chats, success: true });

    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}

exports.PostGroupMessage = async (req, res, next) => {
    try {

        const { groupId, chat } = req.body;
        const id = req.decoded_UserId.userId;

        const member = await Member.findOne({ where: { userId: id, groupId: groupId } })
        if (!member) {
            res.status(409).json({ message: 'You are not a member of this group', success: false })
        }
        const memberId = member.dataValues.id;
        const msg = await Message.create({
            messages: chat,
            groupId: groupId,
            memberId: memberId
        });
        return res.status(203).json({ success: true, msg })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error', success: false });

    }
}

exports.getGroupMessage = async (req, res, next) => {
    try {

        const id = req.query.groupId;

        const group = await Group.findByPk(id);

        // console.log(id, 'id is testing');
        if (group) {
            const message = await Message.findAll({
                where: {
                    groupId: id
                },
                include: [
                    {
                        model: Member,
                        attributes: ['userId']

                    }
                ]
            });

            //console.log('chats :>> ', chats);
            // return res.status(201).json({ success: true, data: ch
            // console.log(message.dataValues[i].memberId);
            // console.log(message);
            return res.status(200).json(message);

        } else {

            return res.status(409).json({ msg: "There is no group exist ", success: false });
        }

    } catch (err) {
        res.status(500).json({ err: err, message: 'Internal server error while fething data from backend', success: false })
        console.log(err);
    }
}

exports.getAllMessages = async (req, res, next) => {
    try {
        const id = req.query.last;
        console.log(id, 'coming from front end as a local storage id');

        const chat = await Message.findAll({
            where: {
                id: {
                    [Sequelize.Op.gt]: id
                }
            }
        });

        // console.log(chat.dataValues, 'chat');
        if (!chat) {
            return res.status(409).json({ message: 'There is no data exist', success: false });
        }
        // console.log(chat);
        res.status(200).json({ messages: chat, success: true });
    } catch (err) {
        res.status(500).json({ err: err, message: 'Internal server error while fething data from backend', success: false })
        console.log(err);
    }
}
exports.getGroupMessageOne = async (req, res, next) => {
    try {

        const id = req.query.groupId;
        const last = req.query.last;

        const group = await Group.findByPk(id);
        // console.log(last,'teting last');
        // console.log(id, 'id is testing',last);
        if (group) {
            const message = await Message.findAll({
                where: {
                    groupId: id,
                    id: {
                        [Sequelize.Op.gt]: last
                    }
                },
                include: [
                    {
                        model: Member,
                        attributes: ['userId']

                    }
                ]
            });

            //console.log('chats :>> ', chats);
            // return res.status(201).json({ success: true, data: ch
            // console.log(message.dataValues[i].memberId);
            // console.log(message);
            return res.status(200).json(message);

        } else {

            return res.status(409).json({ msg: "There is no group exist ", success: false });
        }

    } catch (err) {
        res.status(500).json({ err: err, message: 'Internal server error while fething data from backend', success: false })
        console.log(err);
    }
}