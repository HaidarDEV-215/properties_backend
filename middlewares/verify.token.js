const jwt = require('jsonwebtoken');
const appError = require('../utils/appError.js');
const httpStatus = require('../utils/HTTP.status.text.js');
const TokenBlackList = require('../models/tokensBlackList.js');

const verifyToken = async (req,res,next)=>{
    const auth = req.headers['Authorization']||req.headers['authorization'];
    if(!auth){
        const error = appError.create('token is required',401,httpStatus.ERROR);
        return next(error)
    }
    const token = auth.split(' ')[1];
    try{
        const blockedToken = await TokenBlackList.findOne({token});
        if(blockedToken){
            throw new Error('this token is bloked');
        }
        const currentUser = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;//request manipulation 'تلاعب بالطلب و اضافة خصائص
        next();
    }catch(err){
        const error = appError.create(err.message,401,httpStatus.ERROR);
        return next(error)
    }
}
module.exports = verifyToken