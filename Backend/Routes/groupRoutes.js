const express = require('express');


const routes = express.Router();

const GroupController = require('../Controller/groupController');
const ChatController = require('../Controller/chatController');
const authenticateToken = require('../Middleware/authentication');

routes.post('/create-group', authenticateToken, GroupController.createGroup);
routes.get('/get-groups', authenticateToken, GroupController.getGroups);
//routes.get('/get-all-msg', ChatController.getAllChats);
// routes.get('/get-all-msg/:lsid', ChatController.getAllChats);

module.exports = routes;