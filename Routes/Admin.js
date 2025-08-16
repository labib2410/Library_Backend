const express=require('express');
const router=express.Router();
const{dailyProfit,monthlyProfit,login}=require('../Controllers/adminController');



router.post('/login',login);
router.get('/dailyProfit',dailyProfit);
router.get('/monthlyProfit',monthlyProfit);

module.exports=router;