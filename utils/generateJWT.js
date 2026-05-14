const jwt = require('jsonwebtoken')
module.exports = async (payload)=>{
    const token = await jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'90d'});//expires in 90 day
    return token;
}