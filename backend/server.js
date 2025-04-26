const express = require('express')
require('dotenv').config();
const app = express();
app.use(express.json());
const db = require('./db.js');
const port = process.env.PORT||8592 ;


const User = require('./router/user.js');
const Crop = require('./router/crop.js');
const Order = require('./router/order.js');
const Chat = require('./router/chat.js');
const Rating = require('./router/rating.js');


app.use('/user', User);
app.use('/crop', Crop);
app.use('/order', Order);
app.use('/chat', Chat);
app.use('/rating', Rating);

db.connect().then(()=>{

    
    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
        
    })
    }).catch((error) =>{
    console.error('DataBase connection failed:',error.message);
    
})