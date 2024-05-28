const sequelize=require('../util/database');
const Message=require('../models/Message');
const {Op}=require('sequelize');

exports.sendMessage=async(req,res,next)=>{
    const transact=await sequelize.transaction();
    const {messageContent}=req.body;
    const userId=req.user.dataValues.id;
    try{
        await Message.create({messageContent,userId},{transaction:transact});
        await transact.commit();
        return res.status(200).json({success:true,message:'Message sent!'});
    }catch(err){
        await transact.rollback();
        return res.status(500).json({ success: false, error:'Internal server error!' });
    }
};

exports.getMessages=async(req,res,next)=>{
    const transact=await sequelize.transaction();
    let last=Number(req.query.lastInd)||-1;
    try{
        const messages=await Message.findAll({where:{id:{[Op.gt]:last}}},{transaction:transact})||[];
        if(messages.length>0){
            await transact.commit();
            return res.status(200).json({success:true,messages:messages});
        }else{
            await transact.commit();
            return res.status(200).json({success:true,messages:[]});
        }
    }catch(err){
        await transact.rollback();
        return res.status(500).json({ success: false, error:'Internal server error!' });
    }
};