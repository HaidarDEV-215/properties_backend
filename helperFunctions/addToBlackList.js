const TokenBlackList = require('../models/tokensBlackList.js');

module.exports = async (req,res,next)=>{
    const auth = req.headers['Authorization']||req.headers['authorization'];
    const userToken = auth.split(' ')[1];
    const tokenObject = new TokenBlackList({
        token :userToken,
        email:req.currentUser.email,
        addedAt:Date.now(),
        expiresAt:Date.now() + 90 * 24 * 60 * 60 * 1000
    }); 
    await tokenObject.save();
    return true;
}