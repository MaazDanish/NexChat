const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const ForgotPassword = sequelize.define('forgotpassword', {
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

module.exports = ForgotPassword;