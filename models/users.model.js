const mongoose = require('mongoose');
//uncomment after install validator package //npm install validator
const validator = require ('validator');
const userRoles = require('../utils/userRoles.js');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email :{
        type:String,
        unique:true,
        //uncomment after install validator package //npm install validator
        validate:[validator.isEmail,'filed must be a valid email address'],
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        //
        enum :[userRoles.ADMIN,userRoles.USER,userRoles.MANAGER],
        default:userRoles.USER
    },
    avatar:{
        type:String ,
        default:'upload/binary-musk.png'
    },
    bio:{
        type:String,
        required:false
    }
});




module.exports = mongoose.model('User',userSchema);