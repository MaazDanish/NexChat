const express = require('express');

const routes = express.Router();

const forgotPassword = require('../Controller/forgotPassword')

routes.post('/send-otp-via-email/:email', forgotPassword.sendOTPviaEMail);
routes.post('/verify-otp-via-email/:otp', forgotPassword.verifyOTP);
routes.post('/update-password', forgotPassword.updatePassword);


module.exports = routes;