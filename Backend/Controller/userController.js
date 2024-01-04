const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const User = require('../Models/userModel');


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
            console.log(token);

            return res.status(200).json({ success: true, message: 'User login Successfull', token: token })
        } else {
            return res.status(401).json({ success: false, message: 'One or More field is Incorrect' })
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Internal Server error' })

    }

}