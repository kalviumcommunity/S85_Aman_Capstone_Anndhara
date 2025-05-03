const express = require('express');
const router = express.Router();
const passport =   require("../auth");


const localAuthMiddleware=passport.authenticate('local', { session: false });
const { userCreatePost, userCreateGet, userCreatePut } = require('../Controller/user')
router.post('/register', userCreatePost);
router.get('/', localAuthMiddleware, userCreateGet);
router.put('/update/:id', userCreatePut);






module.exports = router;