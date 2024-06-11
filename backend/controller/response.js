const axios=require("axios")

const result=async (req,res,next)=>{
    try{
    const institute=req.institute
      return res.json({success:true,institute:institute,user:req.user,token:req.user.token});

}
catch(error){
  console.error("Error processing question:", error.message);
  next(error);
}
}
module.exports={result}