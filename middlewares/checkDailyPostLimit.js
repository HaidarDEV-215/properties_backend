const appError = require("../utils/appError.js");
const httpStatus = require("../utils/HTTP.status.text.js");
const Propertie = require("../models/property.model.js");
const {rejectedPropertyImagesCleaner} = require("../helperFunctions/tosImageCleaner.js");

const checkDailyPostLimit = async (req,res,next)=>{
    const userId = req.currentUser.id;
    const todaysProperties = await Propertie.find({owner:userId,createdAt:{$gte:new Date().setHours(0,0,0,0),$lte:new Date().setHours(23,59,59,999)}});
    if(todaysProperties.length >=10){
        const error = appError.create("Daily post limit reached. You can only post up to 10 properties per day.",403,httpStatus.FAIL);
        if(req.files && req.files.length>0){
            await rejectedPropertyImagesCleaner(req,res,next);
        }
        return next(error);
    }
    next();
}

module.exports = checkDailyPostLimit;