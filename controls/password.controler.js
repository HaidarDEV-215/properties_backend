const httpStatus = require('../utils/HTTP.status.text.js');
const appError = require('../utils/appError.js');
const asyncWrapper = require('../middlewares/asyncFunctions.handler.js');
const User = require('../models/users.model.js');
const Otp = require('../models/OTP.model.js');
const generateResetPasswordJWT = require('../utils/generateResetPasswordJWT.js');
const bcrypt = require('bcryptjs');
const sendVerificationEmail = require('../utils/sendVerificationEmail.js');

const resetPasswordRequest = asyncWrapper(async (req,res,next)=>{
    const {email} = req.body;
    if(!email){
        const error = appError.create('user email is required',400,httpStatus.FAIL);
        return next(error);
    }
    const existUser = await User.findOne({email});
    if(!existUser){
        const error = appError.create('user email cannot be found',404,httpStatus.FAIL);
        return next(error);
    }
    const oldOTP = await Otp.findOne({email});
    if(oldOTP){
        await Otp.deleteMany({email});
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000);//generates a 6 digits random number

    const OTP = new Otp({
        user:existUser._id,
        code:verificationCode,
        email:existUser.email,
        expiresAt:Date.now() + (1000 * 60 * 5)// 1000 ms  = 1 sec, 1000ms * 60 = 1 min, 1000 * 60 * 5 = 5 minutes to expire
    });

    await OTP.save();
    
    sendVerificationEmail(email,verificationCode);
    
    res.status(200).json({status:httpStatus.SUCCESS,data:{message:`verification code is sent to ${existUser.email}`}});
})

const confirmOTP = asyncWrapper( async (req,res,next)=>{
    const receivedOTP = req.body.code;
    if(!receivedOTP){
        const error = appError.create('OTP is required',400,httpStatus.FAIL);
        return next(error);
    }
    const receivedEmail = req.body.email?.trim();
    if(!receivedEmail){
        const error = appError.create('email is required',400,httpStatus.FAIL);
        return next(error);
    }
    const foundOtp = await Otp.findOne({email:receivedEmail,code:receivedOTP});
    if(!foundOtp){
        const error = appError.create('invalid code',401,httpStatus.FAIL);
        return next(error);
    }
    if (foundOtp.expiresAt < Date.now()){
        const error = appError.create('invalid code',401,httpStatus.FAIL);
        return next(error);
    }
    await Otp.deleteOne({_id:foundOtp._id});
    const user = await User.findOne({email:receivedEmail});
    if(!user){
        const error = appError.create('user email cannot be found',404,httpStatus.FAIL);
        return next(error);
    }
    const token = await generateResetPasswordJWT({email:user.email,id:user._id,role:user.role});
    res.status(200).json({status:httpStatus.SUCCESS,data:{message:'verified done!',token:token}});
})

const resetUserPassword = asyncWrapper(async(req,res,next)=>{
    const currentUser = req.currentUser;
    const newPassword = req.body.password;
    if(!newPassword){
         const error = appError.create('password is required',400,httpStatus.FAIL);
        return next(error);
    }
    const user = await User.findById(currentUser.id);
    if(!user){
        const error = appError.create('user cannot be found',404,httpStatus.FAIL);
        return next(error);
    }
    const hashPassword = await bcrypt.hash(newPassword,10);
    user.password = hashPassword;
    await user.save();
    res.status(200).json({status:httpStatus.SUCCESS,data:{message:'password reset done!'}});
})

module.exports = {
    resetPasswordRequest,
    confirmOTP,
    resetUserPassword
}