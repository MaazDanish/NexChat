const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Archived_Messages = sequelize.define('archived_message', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true

    },
    messages: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Text'
    },
    groupId: {
        type: Sequelize.UUID,
        allowNull: false
    },
    memberId: {
        type: Sequelize.INTEGER,
    }
})

module.exports = Archived_Messages;