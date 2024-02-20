const User = require('../models/user');
const ForgotPassword = require('../models/forgotPassword');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const sib = require('sib-api-v3-sdk')
const bcrypt = require('bcrypt');
// import { User } from '../Models/userModel';

function generateOTP() {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
exports.sendOTPviaEMail = async (req, res, next) => {
    try {
        const email = req.params.email;
        console.log(email);

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: 'No account with this email found' });
        // console.log(user.id,user,'Testing users details');
        const otp = generateOTP();
        // console.log(otp, 'Testing OTP...........');
        const object = {
            userId: user.id,
            isActive: true,
            otp: otp
        }
        const ForgotPasswordModels = await ForgotPassword.create(object);

        const defaultClient = sib.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        const transporter = nodemailer.createTransport(smtpTransport({
            host: process.env.BREVO_HOST,
            port: process.env.BREVO_PORT,
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.PASS_ID
            }

        }))

        const mailOptions = {
            from: process.env.MAIL_ID,
            to: req.params.email,
            // text: `Your reset password link is here. Click it to change Password - http://localhost:4444/BudgetBuddy/user/password/reset-password/${uuid} This is valid for one time only.`
            text: `Dear User,\n\nWe noticed that you requested to reset your password for your NexChat account. Don't worry, we're here to help you regain access to your account securely.\n\nNexChat is a cutting-edge platform designed to connect you with your friends, family, and colleagues effortlessly. Whether it's staying in touch, collaborating on projects, or simply catching up, NexChat provides a seamless and intuitive experience for all your communication needs.\n\nTo reset your password, please use the following one-time password (OTP) within the next [time frame, e.g., 10 minutes]:\n\n ${otp} \n\nOnce you've entered the OTP, you'll be prompted to create a new password for your NexChat account. If you didn't request this password reset, please disregard this email – your account is still secure.\n\nIf you have any questions or need further assistance, feel free to reach out to our support team at NexChat@gmail.com .\n\nBest regards,\nThe NexChat Team`

        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            } else {
                console.log('Email sent', +info.response);
                res.status(200).json({ success: true })
            }

        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const otp = req.params.otp;
        console.log(otp);

        const OTP_CHECK = await ForgotPassword.findOne({
            where: {
                otp: otp,
                isActive: true
            },
            order: [['updatedAt', 'DESC']]
        });

        if (!OTP_CHECK) {
            return res.status(409).json({ success: false, message: 'OTP does not match' });
        }
        console.log(OTP_CHECK, 'OTP MATCHING');

        res.status(200).json({ OTP_CHECK, success: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        console.log('hi');
        const { password, otp } = req.body;
        console.log(password, otp);
        const fp = await ForgotPassword.findOne({
            where: {
                otp: otp,
                isActive: true
            },
            order: [['updatedAt', 'DESC']]
        });

        const user = await User.findOne({
            where: {
                id: fp.userId
            }
        })

        await fp.update({ isActive: false });

        const hash = await bcrypt.hash(password, 10);

        await user.update({ password: hash });
        
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}