const appError = require("../utils/appError.js");
const httpStatus = require("../utils/HTTP.status.text.js");
const Propertie = require("../models/property.model.js");

const checkDailyPostLimit = async (req,res,next)=>{
    const userId = req.currentUser.id;
    const properties = await Propertie.find({owner:userId});
    if(properties.length >=10){
        const error = appError.create("Daily post limit reached. You can only post up to 10 properties per day.",403,httpStatus.FAIL);
        if(req.files && req.files.length>0){
                    req.files.forEach(file => {
                        //fs.unlink(`uploads/properties${file.filename}`,(err)=>{
                        fs.unlink(file.path,(err)=>{
                            const error = appError.create(`error while deleting property images`,500,httpStatusText.FAIL);
                            return next(error);  
                        })
                        //console.log("file deleted")
                    });
                }
        return next(error);
    }
    next();
}

module.exports = checkDailyPostLimit;