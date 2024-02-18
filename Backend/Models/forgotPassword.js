const Sequelize = require('sequelize');
const sequelize = require('../Util/database');

const ForGotPassWord = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true

    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    otp: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = ForGotPassWord;