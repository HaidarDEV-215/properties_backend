const jwt = require('jsonwebtoken');
const appError = require('../utils/appError.js');
const httpStatus = require('../utils/HTTP.status.text.js');
const verifyToken = (req,res,next)=>{
    const auth = req.headers['Authorization']||req.headers['authorization'];
    if(!auth){
        const error = appError.create('token is required',401,httpStatus.ERROR);
        return next(error)
    }
    //Authorizaton : Bearer kjdsnviness;mgmi4r59234wtk943.r53443r3t3t43tr3/t43t8rjtw
    //split(' ')[1] will take the scound part of Authorization request header that is the token
    const token = auth.split(' ')[1];
    try{
        const currentUser = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;//request manipulation 'تلاعب بالطلب و اضافة خصائص
        next();
    }catch(err){
        const error = appError.create(err.message,401,httpStatus.ERROR);
        return next(error)
    }
    //console.log('token:   ',token);
    //console.log('decoded token:    ',decodedToken);    
}
module.exports = verifyToken