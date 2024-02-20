const express = require('express');

const routes = express.Router();
const UserController = require('../controllers/user');
const { authenticateToken } = require('../middlewares/authentication');
// const authenticateToken = require('../Middleware/authentication');

routes.post('/sign-up', UserController.SignUpUser);
routes.post('/sign-in', UserController.SignIn);
routes.get('/get-user-info', authenticateToken, UserController.getUserInformation);
routes.get('/get-all-user', authenticateToken, UserController.getAllUsers);
routes.get('/get-more-users/:groupId', UserController.getMoreUsers);

module.exports = routes;