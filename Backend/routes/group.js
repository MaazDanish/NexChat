const express = require('express');


const routes = express.Router();

const GroupController = require('../controllers/group');
const { authenticateToken } = require('../middlewares/authentication');

routes.post('/create-group', authenticateToken, GroupController.createGroup);
routes.get('/get-groups', authenticateToken, GroupController.getGroups);
routes.get('/join-groups/:groupId', authenticateToken, GroupController.joinGroup);
routes.get('/get-all-group-users', GroupController.getAllGroupUsers);
routes.post('/add-more-user', GroupController.addMoreUser);
routes.post('/remove-user', GroupController.removeUser);
routes.post('/make-admin', GroupController.makeAdmin);
routes.post('/remove-admin', GroupController.removeAdmin);

module.exports = routes;