const Propertie = require('../models/property.model.js');
const appError = require('../utils/appError.js');
const httpStatus = require('../utils/HTTP.status.text.js')

const verifyOwnership = async (req,res,next)=>{
    const propId = req.params.propId;
    const property = await Propertie.find(propId);
    if(!property){
        const error = appError.create("no properties found",404,httpStatus.FAIL);
        return next(error);
    }
    if(property.owner.toString() !== req.currentUser.id){
        const error = appError.create("Unauthorized",403,httpStatus.FAIL);
        return next(error);
    }
    req.property = property;
    next();
}

module.exports = verifyOwnership;