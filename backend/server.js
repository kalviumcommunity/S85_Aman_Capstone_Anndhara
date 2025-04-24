const express = require('express')
require('dotenv').config();
const app = express();
app.use(express.json());
const db = require('./db.js');
const port = 8592 || process.env.PORT;


const User = require('./router/user.js');
const Crop = require('./router/crop.js');
const Order = require('./router/order.js');
const Chat = require('./router/chat.js');
const Rating = require('./router/rating.js');


app.use('/aman', User);
app.use('/aman', Crop);
app.use('/aman', Order);
app.use('/aman', Chat);
app.use('/aman', Rating);

db.connect().then(()=>{

    
    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
        
    })
    }).catch((error) =>{
    console.error('DataBase connection failed:',error.message);
    
})