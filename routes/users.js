const express=require('express');
const router=express.Router();
const userController=require('../controllers/user');

router.get('/signup',userController.connectSignup);
router.post('/signup',userController.userSignup);
router.get('/login',userController.connectLogin);
router.post('/login',userController.userLogin);

module.exports=router;