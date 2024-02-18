const Sequelize = require('sequelize');
const sequelize = require('../Util/database');

const Archived = sequelize.define('archived', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true

    },
    chat: {
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

module.exports = Archived;