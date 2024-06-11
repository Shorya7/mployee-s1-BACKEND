const express=require("express");
const authcontroller=require("../controller/auth");
const { body }=require("express-validator");
const tokenverify=require("../middleware/isauth");
const mailer=require("../middleware/mailer");



const router=express.Router();

router.post('/signup',
[
   body('email','Please enter a valid mail')
   .normalizeEmail()
   .not()
    .isEmpty()

,
    body('password','Please enter valid password')
    .trim()
    .isLength({min:8}),

    body('name','Please enter valid name')
    .trim()
    .isLength({min:2})

],authcontroller.signup,mailer.sent);

router.post('/login',
[
  body('email','Please enter a valid mail')
  .normalizeEmail()
  .not()
   .isEmpty()

,
   body('password','Please enter valid password')
   .trim()
  .not()
  .isEmpty()
],authcontroller.login);
  

  router.post('/forgotpassword',
  [
    body('email','Please enter a valid mail')
    .normalizeEmail()
    .not()
     .isEmpty()
  ],authcontroller.forgotpassword,mailer.sent);



  router.post('/otpverify',
  [


    body('otp','Please enter a valid otp')
    .not()
     .isEmpty()


  ],tokenverify.verifytoken,authcontroller.otpverify);


  router.put('/resendotp',tokenverify.verifytoken,mailer.sent);


  router.put('/changepassword',
  [
    body('newpassword','Please enter a valid mail')
    .not()
     .isEmpty(),
  ],tokenverify.verifytoken,authcontroller.changepassword);

    

module.exports=router;
