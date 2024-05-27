const express=require('express');
const router=express.Router();

const messageController=require('../controllers/message');
const userAuthentication=require('../middlewares/authentication');

router.post('/sendMessage',userAuthentication,messageController.sendMessage);
router.get('/getMessages',userAuthentication,messageController.getMessages);

module.exports=router;