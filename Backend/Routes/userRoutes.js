const express = require('express');

const routes = express.Router();
const UserController = require('../Controller/userController');

routes.post('/sign-up', UserController.SignUpUser);
routes.post('/sign-in', UserController.SignIn);

module.exports = routes;