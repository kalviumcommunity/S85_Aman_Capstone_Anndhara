const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('./model/user')

passport.use(new LocalStrategy(async function(username, password, done) {
    //authentication Logic here
    try {
        console.log('Receivec credentials: ', username, password);
      
        const KeysID = await UserModel.findOne({ username });
        if (!KeysID) {
           
            return done(null, false, { message: 'Incorrect userName' });
        }
    
        
        const isPassword =  await KeysID.comparePassword(password);
        if (isPassword) {
            
            console.log(KeysID);
            return done(null, KeysID);
        } 
        else{

            return done(null, false,{message:'Invalid Password'});
        }
    } catch (error) {
     
        
        return done(error);
    }
}))

module.exports=passport;