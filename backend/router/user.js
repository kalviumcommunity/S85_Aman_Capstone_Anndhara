const express = require('express');
const router = express.Router();
const { userCreatePost, userCreateGet, userCreatePut,userLoginPost } = require('../Controller/user')
const middleware=require('../middleware/verifyToken')
const passport = require("../auth");


const localAuthMiddleware=passport.authenticate('local', { session: false });
router.post('/register', userCreatePost);
router.post('/login',userLoginPost);
// router.get('/', localAuthMiddleware, userCreateGet);
router.get('/', userCreateGet);
router.put('/update/:id', userCreatePut);






module.exports = router;