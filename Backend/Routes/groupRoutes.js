const express = require('express');


const routes = express.Router();

const GroupController = require('../Controller/groupController');
const ChatController = require('../Controller/chatController');
const authenticateToken = require('../Middleware/authentication');

routes.post('/create-group', authenticateToken, GroupController.createGroup);
routes.get('/get-groups', authenticateToken, GroupController.getGroups);
routes.get('/join-groups/:groupId', authenticateToken, GroupController.joinGroup);
routes.get('/get-all-group-users', GroupController.getAllGroupUsers);
// routes.get('/edit-group-details', GroupController.editGroupUsers);
routes.post('/add-more-user', GroupController.addMoreUser);
routes.post('/remove-user', GroupController.removeUser);
routes.post('/make-admin', GroupController.makeAdmin);
routes.post('/remove-admin', GroupController.removeAdmin);

module.exports = routes;