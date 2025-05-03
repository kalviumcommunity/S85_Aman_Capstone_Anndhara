const express = require('express')
const app = express();
require('dotenv').config();
const passport=require('./auth.js');

app.use(passport.initialize());
const db = require('./db.js');
const port = process.env.PORT || 8592;
const User = require('./router/user.js');
const Crop = require('./router/crop.js');
const Order = require('./router/order.js');
const Message = require('./router/Message.js');
const Rating = require('./router/rating.js');
// const UserModel = require('./model/user.js');
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Request Made to : ${req.originalUrl}`);
    next();
}
app.use(express.json());
app.use(logRequest);

app.use('/user', User);
app.use('/crop', Crop);
app.use('/order', Order);
app.use('/Message', Message);
app.use('/rating', Rating);

db.connect().then(() => {


    app.listen(port, () => {
        console.log(`http://localhost:${port}`);

    })
}).catch((error) => {
    console.error('DataBase connection failed:', error.message);

})