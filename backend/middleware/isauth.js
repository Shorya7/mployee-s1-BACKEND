const jwt=require("jsonwebtoken");
const User=require("../model/user");
const Institute=require("../model/institute");
const verifytoken=async (req,res,next)=>{
    try{
        let token=req.headers['accesstoken']||req.headers['authorization'];
        if(!token)
            return res.json({success:false,msg:"Please login or signup"});
        token=token.replace(/^Bearer\s+/,"")
        const verify=await jwt.verify(token,process.env.secretkey,
        async (err,payload)=>{
            if(err){
                return res.json({success:false,msg:"Invalid or expired token",msg2:err});
            }
            const {email,user}=payload;
      
            const auser=await User.findOne({email});
            const institute=await Institute.findOne({user:user})
            req.user=auser;
            if(institute)
            req.institute=institute
            next();
        });
        }
        catch(error){
             next(error);    

        }
}

module.exports={
    verifytoken
}