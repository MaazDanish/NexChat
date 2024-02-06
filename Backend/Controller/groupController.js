const Group = require('../Models/Group')
const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');
const Member = require('../Models/Member');
const { UUIDV4 } = require('sequelize');


exports.createGroup = async (req, res, next) => {
    try {
        const name = req.body.name;
        const users = req.body.users;
        
        const id = req.decoded_UserId.userId;
       
        const group = await Group.create({ name: name });
       
        const member = await Member.create({ userId: id, admin: true, groupId: group.id });
      

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
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(409).json({ masg: 'no user exist' });
        }
        const groups = await user.getGroups();
       
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
       
        const group = await Group.findAll({
            where: {
                id: groupId
            },
            include: [
                {
                    model: User,
                    attributes: ['name', 'id'],
                    through: { attributes: [] } 
                }
            ],
            order: [['createdAt', 'ASC']]
        });

      
        res.status(200).json(group);

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
}
