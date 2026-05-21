const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');

const tokenBlackListSchema = mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    email:{
        type:String,
        validator:[isEmail,"email value is not valid"],
        required:true
    },
    addedAt:{
        type:Date,
        default:Date.now()
    },
    expiresAt:{
        type:Date,
        required:true,
        expires:0
    }
})

module.exports = mongoose.model('TokenBlackList',tokenBlackListSchema)