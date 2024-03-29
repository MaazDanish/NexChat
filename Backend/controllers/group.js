const Group = require('../models/group')
const User = require('../models/user');
const Member = require('../models/member');
const { UUIDV4 } = require('sequelize');


exports.createGroup = async (req, res, next) => {
    try {
        const { name, users } = req.body;

        const id = req.decoded_UserId.userId;

        const group = await Group.create({ name: name });

        await Member.create({ userId: id, admin: true, owner: true, groupId: group.id });

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

        const userId = req.decoded_UserId.userId;
        const user = await User.findOne({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(409).json({ masg: 'no user exist' });
        }
        const groups = await user.getGroups({
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        res.status(200).json(groups);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: 'internal server error' })
    }
}

exports.joinGroup = async (req, res, next) => {
    try {

        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId);
        if (group) {
            const member = await group.addUser(req.decoded_UserId.userId)

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

        const group = await Group.findOne({ where: { id: groupId } });
        if (!group) throw new Error("No such group");

        const users = await group.getUsers({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'phoneNumber', 'email']
            }
        });
        res.status(200).json({ users });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.addMoreUser = async (req, res, next) => {
    try {
        const { groupId, users } = req.body;
        const group = await Group.findOne({ where: { id: groupId } });

        if (!group) {
            res.status(409).json({ msg: 'There is no group exist', success: false })
        }

        for (var userId of users) {
            const user = await User.findOne({ where: { id: userId } });
            await group.addUser(user);
        }
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}

exports.removeUser = async (req, res, next) => {
    try {
        const { userId, groupId } = req.body;

        const group = await Group.findOne({ where: { id: groupId } });

        if (!group) {
            return res.status(409).json({ msg: 'There is no group exist' })
        }
        const member = await Member.findOne({ where: { userId: userId, groupId: groupId } });

        if (member.dataValues.admin === true) {
            return res.status(408).json({ message: "Admin cannot remove themselves from the group" })
        }

        await member.destroy();
        res.status(200).send('Removed successfully');
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}

exports.makeAdmin = async (req, res, next) => {
    try {
        const { userId, userName, groupId } = req.body;

        const group = await Group.findOne({ where: { id: groupId } });
        if (!group) {
            return res.status(409).json({ success: false, message: 'No group exist' })
        }
        const member = await Member.findOne({ where: { userId: userId, groupId: groupId } });
        if (!member) {
            return res.status(409).json({ success: false, message: 'No member exist ' })
        }
        await member.update({ admin: true });


        res.status(200).json({ success: true });
    } catch (Error) {
        console.log(Error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}
exports.removeAdmin = async (req, res, next) => {
    try {
        const { userId, userName, groupId } = req.body;

        const group = await Group.findOne({ where: { id: groupId } });
        if (!group) {
            return res.status(409).json({ success: false, message: 'No group exist' })
        }
        const member = await Member.findOne({ where: { userId: userId, groupId: groupId } });
        if (!member) {
            return res.status(409).json({ success: false, message: 'No member exist ' })
        }

        await member.update({ admin: false });

        res.status(200).json({ success: true });
    } catch (Error) {
        console.log(Error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}