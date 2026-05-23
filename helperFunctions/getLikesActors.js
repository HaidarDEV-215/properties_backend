const httpStatus = require('../utils/HTTP.status.text.js');
const appError = require('../utils/appError.js');
const Like = require('../models/likes.model.js');

const getLikedProperties = async (userId)=>{
    const LikedProperties = await Like.find({user:userId}).populate('property');//populate is used with Refrenced fileds like Peoperty and User by Object_id
    return LikedProperties;
}









module.exports = {
    getLikedProperties
}