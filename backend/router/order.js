const express = require('express');
const app = express();

// const passport = require('../auth');
// app.use(passport.initialize());
// const localAuthMiddleware=passport.authenticate('local', { session: false });


const { createOrder, getOrders, updateOrder } = require('../Controller/order');

const router = express.Router();


// Middleware to parse incoming requests
app.use(express.json());

// localAuthMiddleware

// Routes
router.post('/result', createOrder);
router.get('/getResult', getOrders);
router.put('/update/:id', updateOrder);

// Export the router
module.exports = router;
