const asyncWrapper= require('../middlewares/asyncFunctions.handler.js');
const httpStatus = require('../utils/HTTP.status.text.js');
const appError = require('../utils/appError.js');
const User = require('../models/users.model.js');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT.js');
const userRoles = require('../utils/userRoles.js');
const { isEmpty } = require('validator');
const fs = require('fs');
const path = require('path');

const getAllUsers = asyncWrapper(async (req,res)=>{
    const query = req.query;
    //console.log(req.query);
    const limit = query.limit || 10;
    const page = query.page || 1 ;
    const skip = (page-1)*limit;
    const users = await User.find({},{"__v":false,"password":false}).limit(limit).skip(skip);
    return res.status(200).json(  {status : httpStatus.SUCCESS ,data:   {users:users}   }   );

})

const getSingleUserInfo = asyncWrapper(async (req,res,next)=>{
    const userId = req.params.userId;
    const user = await User.findById(userId,{"password":false,"__v":false});
    if(!user){
        const error = appError.create("user not found",404,httpStatus.FAIL);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{
        user
    }})
})

const register = asyncWrapper( async (req,res,next)=>{
    //console.log("request :   ",req.body);
    //console.log("request file : ",req.file); // this attribute created by multer (upload) from routes file
    const{firstName,lastName,email,avatar,password,role,bio,phone} = req.body;
    const oldUser = await User.findOne({email});
    if(oldUser){
        if(req,file){
            fs.unlink(req.file.path,(err)=>{
                console.log(err);                
            });
            console.log('deleted successfuly');            
        }
        const error = appError.create(`user with email ${req.body.email} is already exist`,400,httpStatus.FAIL);
        return next(error);
    } 
    //password hashing
    const hashPassword = await bcrypt.hash(password,10);
    const newUser = new User({
        firstName,
        lastName,
        email,
        password:hashPassword,
        avatar: req.file.filename,
        bio,
        phone
    })

    //create jwt token
    //jwt.sign("payload","secret key must store in .env file",option like expire time(secounds : s, minutes : m, days : d))
    //require('crypto').randomBytes(32).toString('hex')
    const token = await generateJWT({email:newUser.email,id:newUser._id,role:newUser.role});
    //newUser.token=token;
    await newUser.save();
    res.status(201).json({status:httpStatus.SUCCESS,data:{token}})
     
})

const login = asyncWrapper( async (req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        const error = appError.create('email and password are required',400,httpStatus.FAIL)
        return next(error);
    }
    const user = await User.findOne({email});
    if(!user){
        const error = appError.create('Invalid email or password',401,httpStatus.ERROR);
        return next(error); 
    }
    const matchedPassword = await bcrypt.compare(password,user.password)
    //const matchedPassword = (password==user.password);
    if(user && matchedPassword){
        const token = await generateJWT({email:user.email,id:user._id,role:user.role});
        return res.status(200).json(  {status : httpStatus.SUCCESS ,data:   {token:token}   }   );
    }else{
        const error = appError.create('Invalid email or password',401,httpStatus.ERROR);
        return next(error); 
    }
})

const deleteAccount =asyncWrapper(async (req,res,next)=>{
    const userId = req.params.userId;
    const usertoDelete = await User.findByIdAndDelete(userId);
    if(usertoDelete.avatar){
        const avatarPath = path.join(__dirname,'..','uploads','users',usertoDelete.avatar);
        fs.unlink(avatarPath,(err)=>{
            console.log(err);            
        });
        console.log('deleted successfuly');
    }
    if(!usertoDelete){
            const error = appError.create('this user cannot be found',404,httpStatus.FAIL);
            return next(error);
        }
    res.status(200).json({status:httpStatus.SUCCESS,data:{message:'user deleted successfuly'}});
})

const updateAccountInfo = asyncWrapper(async (req,res,next)=>{
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if(!user){
        const error = appError.create("user not found",404,httpStatus.FAIL);
        return next(error);
    }
    const updates = req.body;
    console.log('updates : ',updates);
    
    const invalidUpdates = ['password','_id','role','email'];
    for(let field of invalidUpdates){
        if(updates[field]){
            delete updates[field];
        }
    }
    const updatedUser = await User.findByIdAndUpdate(userId,updates,{
        returnDocument:'after',
        runValidators:true
    }).select('-password');
    if(!updatedUser){
        const error = appError.create('server error',500,httpStatus.ERROR);
        return next(error);
    }
    res.status(200).json({status:httpStatus.SUCCESS,data:{newUser :updatedUser,message:"user updated successfuly"}});
})

const updateUserAvatar = asyncWrapper( async (req,res,next) =>{
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if(!user){
        const error = appError.create("user not found",404,httpStatus.FAIL);
        return next(error);
    }
    if(user.avatar !== 'defaultUserAvatar.png'){
        const oldAvatarPath = path.join(__dirname,'..','uploads','users',user.avatar);
        fs.unlink(oldAvatarPath,(err)=>{
            console.error(err);            
        })
    }
    //console.log("the file : ",req.file.filename)
    user.avatar = req.file.filename;
    await user.save();
    res.status(200).json({status:httpStatus.SUCCESS,data:{message:'avatar uploaded successfuly'}});
})

module.exports = {
    getAllUsers,
    getSingleUserInfo,
    register,
    login,
    deleteAccount,
    updateAccountInfo,
    updateUserAvatar
}