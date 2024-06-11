const mongoose=require('mongoose');

const schema=mongoose.Schema;

const userschema=new schema({
    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
  otp:{
        type:String
    },

    expireotp:{
        type:Date
    },

    token:{
        type:String
    },

    emailverify:{
        type:Boolean,
        default:false
    }


});

module.exports=mongoose.model("user",userschema);
