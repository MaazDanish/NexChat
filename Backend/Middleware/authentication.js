const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            // console.error('Error verifying token:', err);
            return res.status(500).json({ success: false, message: 'Failed to authenticate token' });
        }

    
        // console.log(decoded);
        req.decoded_UserId = decoded;
        // console.log(req.decoded_UserId,'decoded id');
        next();
    });
};

module.exports = authenticateToken;


