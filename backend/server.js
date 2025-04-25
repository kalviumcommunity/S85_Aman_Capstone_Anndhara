const express=require('express')
require('dotenv').config();

const db=require('./db.js');
const port =8592||process.env.PORT;

const app = express();
app.use(express.json());


app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
    
})