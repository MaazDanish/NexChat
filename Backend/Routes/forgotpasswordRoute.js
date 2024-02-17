const express = require('express');

const routes = express.Router();

routes.post('/create-group', GroupController.createGroup);
routes.get('/get-groups', GroupController.getGroups);