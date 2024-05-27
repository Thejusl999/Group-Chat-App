const sequelize=require('../util/database');
const Message=require('../models/Message');

exports.sendMessage=async(req,res,next)=>{
    const transact=await sequelize.transaction();
    const {messageContent}=req.body;
    const userId=req.user.dataValues.id;
    try{
        await Message.create({messageContent,userId},{transaction:transact});
        await transact.commit();
        return res.status(200).json({success:true,message:'Message sent!'});
    }catch(err){
        console.log(err)
        await transact.rollback();
        return res.status(500).json({ success: false, error:'Internal server error!' });
    }
};
