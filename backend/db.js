const mongoose=require('mongoose')
const Url=process.env.DB_URL;
const connect=async () => {
    try {
        
        mongoose.connect(Url).then(()=>{
            console.log('MongoDB Connected');
        }).catch((error)=>{
            console.error('MongoDB Not Connected',error.message);
        })
        
    } catch (error) {
        console.error('Database connection failed: ',error.message);
        
    }
}
module.exports={connect};