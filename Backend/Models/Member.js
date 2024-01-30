const Sequelize = require('sequelize');
const sequelize = require('../Util/database');

const Member = sequelize.define('member', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true

    },
    admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})

module.exports = Member;