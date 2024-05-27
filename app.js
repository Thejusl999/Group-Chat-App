require('dotenv').config();
const path=require('path');
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');

const sequelize=require('./util/database');

const app=express();
app.use(
    cors({
        origin:"*",
        credentials:true
    })
);
app.use(bodyParser.json({extended:false}));
app.use(express.static(path.join(__dirname,'.',"public")));

const userRoutes=require('./routes/users');
const messageRoutes=require('./routes/messages');

const User = require('./models/User');
const Message=require('./models/Message');

app.use('/user',userRoutes);
app.use('/home',messageRoutes);

User.hasMany(Message);
Message.belongsTo(User);

sequelize
    .sync()
    .then(result=>app.listen(process.env.PORT||3000))
    .catch(error=>console.log(error));