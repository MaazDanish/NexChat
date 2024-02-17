const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./Util/database');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const groupRoutes = require('./Routes/groupRoutes');

const User = require('./Models/userModel');
const Chat = require('./Models/chatModel');
const Group = require('./Models/Group');
const Member = require('./Models/Member');
const { socketToken } = require('./Middleware/authentication');
const messageRoutes = require('./Routes/chatsRoutes');

const app = express();

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: ["http://127.0.0.1:5500"]
});

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(express.json());

app.use('/nexchat/user', userRoutes);
app.use('/nexchat/chats', chatRoutes);
app.use('/nexchat/group', groupRoutes);

// User.hasMany(Chat);
// Chat.belongsTo(User);

User.belongsToMany(Group, { through: Member });
Group.belongsToMany(User, { through: Member });

Group.hasMany(Chat);
Chat.belongsTo(Group);

Member.hasMany(Chat);
Chat.belongsTo(Member);



sequelize.sync().then(() => {
    const connection = (socket) => {
        socket.use(async (packet, next) => {
            await socketToken(socket, next);
        })
        console.log(socket.id);
        messageRoutes(io, socket);
    }
    // app.listen();
    io.on('connection', connection);
    httpServer.listen(process.env.PORT_NUMBER)
    console.log(`Server is running on port ${process.env.PORT_NUMBER}`);
}).catch(err => {
    console.log('Server is not running due to internal problem');
})

