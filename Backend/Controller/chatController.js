const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');


exports.PostChat = async (req, res, next) => {
    try {
        const { chat } = req.body;
        // console.log(chat);
        // console.log(req.decoded_UserId.userId);
        const userId = req.decoded_UserId.userId;
        const chats = await Chat.create({
            chat: chat,
            userId: userId
        });
        // console.log(chats);
        res.status(200).json({ chat: chats, success: true });

    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}

exports.getChat = async (req, res, next) => {
    try {
        const userId = req.decoded_UserId.userId;

        const chat = await Chat.findAll({ where: { userId: userId } });
        console.log(chat.dataValues,'chat');
        if (!chat) {
            return res.status(409).json({ message: 'There is no data exist', success: false });
        }

        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json({ err: err, message: 'Internal server error while fething data from backend', success: false })
        console.log(err);
    }
}