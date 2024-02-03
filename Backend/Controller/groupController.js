const Group = require('../Models/Group')
const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');
const Member = require('../Models/Member');
const { UUIDV4 } = require('sequelize');


exports.createGroup = async (req, res, next) => {
    try {
        const name = req.body.name;
        const users = req.body.users;
        console.log(users, 'adding users are here');
        console.log(name);
        const id = req.decoded_UserId.userId;
        console.log(id);
        const group = await Group.create({ name: name });
        //  const member = await Member.create({ userId: id, admin: true }, group, { through: { admin: true } })
        const member = await Member.create({ userId: id, admin: true, groupId: group.id });
        console.log(group, member);

        for (const userId of users) {
            await Member.create({ userId: userId, groupId: group.id })
        }

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
        console.log(groups);
        res.status(200).json(groups);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: 'internal server error' })
    }
}

exports.joinGroup = async (req, res, next) => {
    try {
        console.log('joining group controller ');
        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId);
        if (group) {
            const member = await group.addUser(req.decoded_UserId.userId)
            console.log(member);
            return res.status(200).json(member);
        } else {
            res.status(409).json({ masg: 'Group not exist' });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.getAllGroupUsers = async (req, res, next) => {
    try {
        const groupId = req.query.groupId;
        console.log(groupId, 'tetsing');
        const group = await Group.findAll({
            where: {
                id: groupId
            },
            include: [
                {
                    model: User,
                    attributes: ['name'],
                    through: { attributes: [] } // If you don't want to include any additional attributes from the "through" table
                }
            ],
            order: [['createdAt', 'ASC']]
        });

        console.log(group);
        res.status(200).json(group);

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
}
