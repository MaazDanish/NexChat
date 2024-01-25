const Group = require('../Models/Group')
const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');
const Member = require('../Models/Member');
const { UUIDV4 } = require('sequelize');


exports.createGroup = async (req, res, next) => {
    try {
        const name = req.body.name;
        console.log(name);
        const id = req.decoded_UserId.userId;
        console.log(id);
        const group = await Group.create({ name: name });
        //  const member = await Member.create({ userId: id, admin: true }, group, { through: { admin: true } })
        const member = await Member.create({ userId: id, admin: true, groupId: group.id });
        console.log(group, member);
        return res.status(200).json(group);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: 'internal server error' })
    }
}

exports.getGroups = async (req, res, next) => {
    try {
        console.log('hiiii');
        const userId = req.decoded_UserId.userId;
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(409).json({ masg: 'no user existF' });
        }
        const groups = await user.getGroups();


        //const groups = await req.decoded_UserId.userId.getGroups();
        console.log(groups);
        res.status(200).json(groups);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: 'internal server error' })
    }
}

