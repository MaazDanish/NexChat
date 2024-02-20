const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./utils/database');
const user = require('./routes/user');
const message = require('./routes/message');
const group = require('./routes/group');
const forgotPassword = require('./routes/forgotpassword');
const messages = require('./routes/socket_Io')

const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const Member = require('./models/member');
const ForgotPassword = require('./models/forgotPassword');
const { socketToken } = require('./middlewares/authentication');
const cronJob = require('./utils/cronJob')

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

app.use('/nexchat/user', user);
// app.use('/nexchat/chats', message);
app.use('/nexchat/group', group);
app.use('/nexchat/password', forgotPassword);

// User.hasMany(Chat);
// Chat.belongsTo(User);

User.belongsToMany(Group, { through: Member });
Group.belongsToMany(User, { through: Member });

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

Member.hasMany(Message);
Message.belongsTo(Member);



sequelize.sync().then(() => {
    const connection = (socket) => {
        socket.use(async (packet, next) => {
            await socketToken(socket, next);
        })
        console.log(socket.id);
        messages(io, socket);
    }
    // app.listen();
    io.on('connection', connection);
    httpServer.listen(process.env.PORT_NUMBER)
    console.log(`Server is running on port ${process.env.PORT_NUMBER}`);
}).catch(err => {
    console.log('Server is not running due to internal problem',err);
})

