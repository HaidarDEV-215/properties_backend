const TokenBlackList = require('../models/tokensBlackList.js');
const jwt = require('jsonwebtoken');
module.exports = async (req,res,next)=>{
    const auth = req.headers['Authorization']||req.headers['authorization'];
    const userToken = auth.split(' ')[1];
    const decodedToken = jwt.decode(userToken,process.env.JWT_SECRET_KEY);
    const tokenExpiresAt = decodedToken.exp * 1000; // convert to milliseconds
    const tokenObject = new TokenBlackList({
        token :userToken,
        email:req.currentUser.email,
        addedAt:Date.now(),
        expiresAt:tokenExpiresAt//expiresAt is the time when the token will be expired and can be removed from black list
    }); 
    await tokenObject.save();
    return true;
}