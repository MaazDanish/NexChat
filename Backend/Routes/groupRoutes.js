const express = require('express');


const routes = express.Router();

const GroupController = require('../Controller/groupController');
const ChatController = require('../Controller/chatController');
const authenticateToken = require('../Middleware/authentication');

routes.post('/create-group', authenticateToken, GroupController.createGroup);
routes.get('/get-groups', authenticateToken, GroupController.getGroups);
routes.get('/join-groups/:groupId', authenticateToken, GroupController.joinGroup);
routes.get('/get-all-group-users', GroupController.getAllGroupUsers);

module.exports = routes;