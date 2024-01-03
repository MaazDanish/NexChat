const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./Util/database');
const userRoutes = require('./Routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/nexchat/user', userRoutes);


sequelize.sync().then(res => {
    app.listen(process.env.PORT_NUMBER);
    console.log(`Server is running on port ${process.env.PORT_NUMBER}`);
}).catch(err => {
    console.log('Server is not running due to internal problem');
})

