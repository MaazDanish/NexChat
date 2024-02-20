const jwt = require('jsonwebtoken');
const { Socket } = require('socket.io');
const User = require('../models/user');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            // console.error('Error verifying token:', err);
            return res.status(500).json({ success: false, message: 'Failed to authenticate token' });
        }
        req.decoded_UserId = decoded;
        console.log(req.decoded_UserId);
        // console.log(req.decoded_UserId,'decoded id');
        next();
    });
};
const socketToken =  (socket, next) => {
    console.log('SOCKET TOKEN');
    const token = socket.handshake.auth.token;
    console.log(token);


    jwt.verify(token, process.env.SECRET_KEY,async (err, decoded) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to authenticate token' });
        }
        const user = await User.findOne({
            where: {
                id: decoded.userId,
            }
        })
        console.log(user);
        socket.user = user;
        console.log(socket.user, 'dECODED OF SOCKET TOKEN');
        // console.log(socket.User);
        next();
    });
};

module.exports = { authenticateToken, socketToken };


