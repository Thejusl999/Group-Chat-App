const path=require('path');
const sequelize=require('../util/database');
const bcrypt=require('bcrypt');
const User = require('../models/User');

exports.connectSignup=(req,res,next)=>{
    res.sendFile(path.join(__dirname,"..",'public','html','signup.html'));
};

exports.userSignup=async(req,res,next)=>{
    const transact=await sequelize.transaction();
    const {name,email,phone,password}=req.body;
    const newUser={name,email,phone,password};
    try{
        const hash=await bcrypt.hash(newUser.password,10);
        await User.create({...newUser,password:hash});
        await transact.commit();
        return res.status(200).json({success:true,newUser});
    }catch(err){
        if (err.original.code === "ER_DUP_ENTRY") {
            await transact.rollback();
            return res.status(403).json({ success: false, error: err.original.code });
          } else {
            await transact.rollback();
            return res.status(500).json({ success: false, error: err });
          }
    }
};