const User=require('../model/user');
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const regex=require("../middleware/regex");
const { validationResult } = require('express-validator');


const signup=async (req,res,next)=>{
   try{
    const {email,password}=req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      next(error);
    }
    const old=await User.findOne({email:email.toLowerCase()})
    if(!old){

    if(!regex.checkPassword(password))
     {
      return res.json({success:false,msg:"Please enter a strong password"});
     }

      
      const encpassword=await bcrypt.hash(password,12);


      await User.create({
         email:email.toLowerCase(),
         password:encpassword,
     });
     next();
   }
   else{
      if(!old.emailverify){
         next();
   }         else{
      return res.json({success:false,msg:"User already exists"});
   }
}
   }
catch(error){
   console.log(error);
   next(error);

}
}

const login=async (req,res,next)=>{
   try{


   const {email,password}=req.body;  


const user=await User.findOne({email:email.toLowerCase()});
if(!user)
   return res.json({success:false,msg:"User not found"});
if(user.emailverify==true)
{      
   const cmp=await bcrypt.compare(password,user.password);
   if(!cmp)
      return res.json({success:false,msg:"Wrong password"});
   const token=jwt.sign({email:email.toLowerCase(),user:user._id},process.env.secretkey,{expiresIn:"1d"});
   const updated= await User.updateOne({email:email.toLowerCase()},{
   $set:{
      token:token
   }});
   if(updated)
   {
      return res.json({success:true,msg:`Welcome`,token});
   }
}
else{
   return res.json({success:false,msg:"Email not verified"});
}
}
catch(error){
   console.log(error);
   next(error);
}
}

const forgotpassword=async (req,res,next)=>{
   try{
      const email=req.body.email;
      const user=await User.findOne({email:email.toLowerCase()})
      if(!user){
         return res.json({success:"false",message:"User not found"});
      }
      const token=jwt.sign({email:email.toLowerCase(),user:user._id},process.env.secretkey,{expiresIn:"1d"});
      const updated= await User.updateOne({email:email.toLowerCase()},{
         $set:{
            token
         }});
         if(updated)
         {
            next();
         }
   }
   catch(err)
   {
      console.log(err);
      next(err);
   }
}

const otpverify=async (req,res,next)=>{
   try{
      const email=req.user.email;
      const otp=req.body.otp;
      if(!otp)
      return res.json({success:false,msg:"Please enter the otp"})
      const user=await User.findOne({email:email.toLowerCase()});
      if(!user)
      return res.json({success:false,msg:"User does not exists"});
      const result=await bcrypt.compare(otp,user.otp);
      const token=jwt.sign({email:email.toLowerCase(),user:user._id},process.env.secretkey,{expiresIn:"1d"});
      if(result)
      {
         const updated= await User.updateOne({email:email.toLowerCase()},{
            $set:{
               token,
               emailverify:true
            }});
            if(updated)
            {
               return res.json({success:true,msg:"OTP verified",token});
            }
      }
      return res.json({success:false,msg:"Wrong OTP entered"});
      

   }
   catch(err)
   {
      console.log(err);
      next(err);
   }
}

const changepassword=async (req,res,next)=>{
   try{
     const newpassword=req.body.newpassword;
     
      if(!checkpassword(newpassword))
     {
      return res.json({success:false,msg:"Please enter a strong password"});
     }
     const encpassword=await bcrypt.hash(newpassword,12);
     const user=await User.findOne({email:req.user.email});
     const updated= await User.updateOne({email:req.user.email},{
      $set:{
         password:encpassword
      }});
      if(updated)
      {
         return res.json({success:true,msg:"Password changed",token:user.token});
      }

      return res.json({success:false,msg:"Password change failed"});

     
   }
   catch(err){
      console.log(err);
      next(err);
   }
}

module.exports={
   signup,
   login,
   otpverify,
   changepassword,
   forgotpassword
}