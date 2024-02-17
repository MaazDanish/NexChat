// const User = require('../models/User');
import { User } from '../models';
const resetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log(email);
        if (!email) return res.status(401).json({ error: 'Email is required' });

        const user = await User.findOne({ where: { email }});
        if (!user) return res.status(400).json({ error: 'No account with this email found' });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}