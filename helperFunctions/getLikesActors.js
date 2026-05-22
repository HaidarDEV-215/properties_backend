const httpStatus = require('../utils/HTTP.status.text.js');
const appError = require('../utils/appError.js');
const Like = require('../models/likes.model.js');
const getPropertiesByIds = require('./getPropertiesById.js');

const getLikedProperties = async (userId)=>{
    const LikedProperties = await Like.find({user:userId});
    const propertiesIds = [];
    LikedProperties.forEach(like=>{
        propertiesIds.push(like.property);
    })
    const properties = await getPropertiesByIds(propertiesIds);
    return properties;
}


module.exports = {
    getLikedProperties
}