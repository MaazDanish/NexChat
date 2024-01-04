const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./Util/database');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');

const User = require('./Models/userModel');
const Chat = require('./Models/chatModel');

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(express.json());

app.use('/nexchat/user', userRoutes);
app.use('/nexchat/chats', chatRoutes);


User.hasMany(Chat);
Chat.belongsTo(User);

sequelize.sync().then(res => {
    app.listen(process.env.PORT_NUMBER);
    console.log(`Server is running on port ${process.env.PORT_NUMBER}`);
}).catch(err => {
    console.log('Server is not running due to internal problem');
})

