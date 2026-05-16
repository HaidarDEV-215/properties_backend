const jwt = require('jsonwebtoken')
module.exports = async (payload)=>{
    const token = await jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'5m'});//expires in 5 mins
    return token;
}