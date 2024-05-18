const express=require('express');
const router=express.Router();
const userController=require('../controllers/user');

router.get('/signup',userController.connectSignup);
router.post('/signup',userController.userSignup);

module.exports=router;