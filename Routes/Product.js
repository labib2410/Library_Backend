const express =require('express');
const router=express.Router();
const {addProduct,deleteProduct,updateProduct,getAllProducts,getLowStockProducts}=require('../Controllers/ProductController');

router.post('/addProduct',addProduct);
router.get('/getAllProducts', getAllProducts);
router.get('/getLowStock',getLowStockProducts);
router.delete('/deleteProduct', deleteProduct);
router.put('/updateProduct', updateProduct);


module.exports=router;