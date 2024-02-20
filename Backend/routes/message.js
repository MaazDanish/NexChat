const express = require('express');


const routes = express.Router();
const Message = require('../controllers/message');
const { authenticateToken } = require('../middlewares/authentication');

// routes.post('/send-msg', authenticateToken, Message.PostChat);
// routes.post('/send-group-msg', authenticateToken, Message.PostGroupChat);
// routes.get('/get-group-msg', Message.getGroupChat);
// routes.get('/get-group-msg', Message.getGroupChatOne);
// routes.get('/get-all-msg', Message.getAllChats);
// routes.get('/get-all-msg/:lsid', Message.getAllChats);

module.exports = routes;