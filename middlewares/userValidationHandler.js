const {validationResult} = require('express-validator');
const httpStatusText = require('../utils/HTTP.status.text.js');
const appError = require('../utils/appError.js')
const fs = require ('fs');

const userValidationHandler = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        await rejectedUserImageCleaner(req,res,next);
        const error = appError.create(errors.array(),400,httpStatusText.FAIL);
        return next(error);
    }
    next();
}

module.exports = {userValidationHandler};