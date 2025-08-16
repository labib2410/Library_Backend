const express =require('express');
const router=express.Router();
const {createOrder, getOrdersInDay, getOrdersInMonth, deleteOrder}=require('../Controllers/OrderController');

router.post('/createOrder',createOrder);
router.get('/getOrderInDay', getOrdersInDay);
router.get('/getOrderInMonth', getOrdersInMonth);
router.delete('/deleteOrder/:id', deleteOrder);

module.exports=router;