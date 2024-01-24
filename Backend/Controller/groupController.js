const Group = require('../Models/Group')
const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');


exports.createGroup = async (req, res, next) => {
    try {
        const name = req.body.name;
        console.log(name);
        const id = req.decoded_UserId;
        console.log(id);
        const group = await Group.create({ name: name, admin: true });
        const member = await req.decoded_UserId.addGroup(group, { through: { admin: true } })
        console.log(group,member);
        return res.status(200).json(group);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: 'internal server error' })
    }
}

exports.getGroups = async (req, res, next) => {
    try {
        const groups = await req.decoded_UserId.getGroups();
        console.log(groups);
        res.status(200).json(groups);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: 'internal server error' })
    }
}
