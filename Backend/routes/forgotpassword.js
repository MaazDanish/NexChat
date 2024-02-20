const express = require('express');

const routes = express.Router();

const ForgotPassword = require('../controllers/ForgotPassword')

routes.post('/send-otp-via-email/:email', ForgotPassword.sendOTPviaEMail);
routes.post('/verify-otp-via-email/:otp', ForgotPassword.verifyOTP);
routes.post('/update-password', ForgotPassword.updatePassword);


module.exports = routes;