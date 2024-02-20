const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize')
const { Sequelize } = require('sequelize');

const Group = require('../models/group')
const User = require('../models/user');

exports.SignUpUser = async (req, res, next) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        const existingUser = await User.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exist with this email.Please Login', success: false })
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name, email: email, phoneNumber: phoneNumber, password: hash
        })

        return res.status(200).json({ user: newUser, success: true, message: 'Your account is created successfully' })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Error', success: false });
    }
}

exports.SignIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ message: 'User Not Found.Please SignUp', success: false })
        }
        const matchingPassword = await bcrypt.compare(password, user.password);

        if (matchingPassword) {
            // console.log(user.id, 'user id');
            const payload = {
                userId: user.id
            }

            let token = jwt.sign(payload, process.env.SECRET_KEY);
            // console.log(token, 'token');
            // console.log(token);

            return res.status(200).json({ success: true, message: 'User login Successfull', token: token })
        } else {
            return res.status(401).json({ success: false, message: 'One or More field is Incorrect' })
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Internal Server error' })

    }

}

exports.getUserInformation = async (req, res, next) => {
    try {
        const userId = req.decoded_UserId.userId;
        // console.log(userId);

        const user = await User.findOne({
            where: {
                id: userId
            },
            attributes: ['id', 'name', 'phoneNumber', 'email']
        });

        if (!user) {
            return res.status(409).json({ message: "User does not exist", success: false });
        }

        res.status(200).json(user);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);

    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            where: {
                id: {
                    [sequelize.Op.ne]: req.decoded_UserId.userId
                }
            },
            attributes: ['name', 'id']

        });

        res.status(200).json({ message: 'successfull', users })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}
// getting users for adding in agroup where memvbers already added.so here we will filter those mebers
exports.getMoreUsers = async (req, res, next) => {
    try {
        // console.log('hiiiiiiiiiiiiiiiii');
        const groupId = req.params.groupId;
        // console.log(groupId);
        // const user = req.decoded_UserId.userId;
        const group = await Group.findOne({ where: { id: groupId } })
        const users = await group.getUsers();
        const userId = users.map(user => user.id);
        // console.log(userId);

        const allUser = await User.findAll({
            where: {
                id: {
                    [Sequelize.Op.notIn]: userId
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'phoneNumber', 'email']
            }
        })
        // console.log(allUser);
        res.status(200).json(allUser);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}