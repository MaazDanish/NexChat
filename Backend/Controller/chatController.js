const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');
const Member = require('../Models/Member');
const Group = require('../Models/Group');
const { Sequelize } = require('sequelize');


exports.PostChat = async (req, res, next) => {
    try {
        const { chat } = req.body;
        const userId = req.decoded_UserId.userId;
        const chats = await Chat.create({
            chat: chat,
            userId: userId
        });

        res.status(200).json({ chat: chats, success: true });

    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}

exports.PostGroupChat = async (req, res, next) => {
    try {

        const { groupId, memberId, chat } = req.body;
        // const id = groupId;
        // console.log(groupId, memberId, chat, 'TESTING IN POST CHAT CONTROLLER');

        // const member = await Member.findOne({ groupId, id: memberId });
        // console.log(member);

        // const message = await member.createChat({ chat, groupId });
        const msg = await Chat.create({
            chat: chat,
            groupId: groupId,
            memberId: memberId
        });

        // const group = await Group.findByPk(id);

        // console.log(msg);

        return res.status(203).json({ success: true, msg })


    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error', success: false });

    }
}

exports.getGroupChat = async (req, res, next) => {
    try {
        // const userId = req.decoded_UserId.userId;
        const id = req.query.groupId;
        console.log(id);
        const group = await Group.findByPk(id);
        console.log(group);
        if (group) {
            const message = await Chat.findAll({ where: { groupId: id } })
            return res.status(200).json({ success: true, msg: "successfully fecthed", message });
        } else {
            return res.status(409).json({ msg: "There is no group exist ", success: false });
        }
    } catch (err) {
        res.status(500).json({ err: err, message: 'Internal server error while fething data from backend', success: false })
        console.log(err);
    }
}

exports.getAllChats = async (req, res, next) => {
    try {
        const id = req.query.last;
        console.log(id, 'coming frm fronte nd as a local storage id');

        const chat = await Chat.findAll({
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

// exports.getAllChats = async (req, res, next) => {
//     try {
//         // lsid local storage id
//         const id = req.query.id;
//         console.log(id, 'Local storage id coming from front end');

//         const messages = await Chat.findAll({
//             where: {
//                 id: {
//                     [Op.gt]: id
//                 }
//             }
//         });

//         // console.log(chat.dataValues, 'chat');

//         const userId = req.decoded_UserId.userId;
//         console.log(userId,'usr id in get all chats for local storage');
//         if (!messages) {
//             return res.status(409).json({ message: 'There is no data exist', success: false });
//         }
//         // console.log(chat);
//         res.status(200).json({ messages: messages, success: true });
//     } catch (err) {
//         res.status(500).json({ err: err, message: 'Internal server error while fething data from backend', success: false })
//         console.log(err);
//     }
// }