const path=require('path');
const sequelize=require('../util/database');
const bcrypt=require('bcrypt');
const User = require('../models/User');
const jsonwebtoken=require('jsonwebtoken');

//SIGNUP MIDDLEWARES
exports.connectSignup=(req,res,next)=>{
    res.sendFile(path.join(__dirname,"..",'public','html','signup.html'));
};

exports.userSignup=async(req,res,next)=>{
    const transact=await sequelize.transaction();
    const {name,email,phone,password}=req.body;
    const newUser={name,email,phone,password};
    try{
        const hash=await bcrypt.hash(newUser.password,10);
        await User.create({...newUser,password:hash},{transaction:transact});
        await transact.commit();
        return res.status(200).json({success:true,newUser});
    }catch(err){
        if (err.original.code === "ER_DUP_ENTRY") {
            await transact.rollback();
            return res.status(403).json({ success: false, error: err.original.code });
          } else {
            await transact.rollback();
            return res.status(500).json({ success: false, error:'Internal server error!' });
          }
    }
};

//LOGIN MIDDLEWARES
exports.connectLogin=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','public','html','login.html'));
};

const generateToken=(id,name)=>{
    return jsonwebtoken.sign({userId:id,username:name},process.env.JWTSECRETKEY);
};

exports.userLogin=async (req,res,next)=>{
    const transact=await sequelize.transaction();
    const {email,password}=req.body;
    try{
        const user=await User.findOne({where:{email:email},transaction:transact});
        if(user){
            const userData=user.dataValues;
            const result=await bcrypt.compare(password,userData.password);
            if(result){
                await transact.commit();
                return res.status(200).json({
                    success:true,
                    message:'Successfully logged in!',
                    token:generateToken(userData.id,userData.name)
                });
            }else{
                await transact.commit();
                return res.status(401).json({
                    success:false,
                    error:'User not authorized!'
                });
            }
        }else{
            await transact.commit();
            return res.status(404).json({
                success:false,
                error:'User not found!'
            });
        }
    }catch(err){
        await transact.rollback();
        return res.status(500).json({
            success:false,
            error:'Internal server error!'
        });
    }
};