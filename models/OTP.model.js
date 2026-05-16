const mongoose = require('mongoose');
const validator = require('validator');

const OTPSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    code:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        validate:[validator.isEmail,'filed must be a valid email address'],
        required:true

    },
    expiresAt:{
        type:Date,
        required:true,
        expires:0// it makes mongo delete object at this time, it check time every 60 minutes
    }
});

module.exports = mongoose.model('Otp',OTPSchema);