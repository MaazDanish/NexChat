const express = require('express');


const routes = express.Router();
// const UserController = require('../Controller/userController');
const ChatController = require('../Controller/chatController');
const authenticateToken = require('../Middleware/authentication');

// routes.post('/send-msg', authenticateToken, ChatController.PostChat);
routes.post('/send-group-msg', ChatController.PostGroupChat);
routes.get('/get-group-msg', ChatController.getGroupChat);
// routes.get('/get-all-msg', ChatController.getAllChats);
// routes.get('/get-all-msg/:lsid', ChatController.getAllChats);

module.exports = routes;