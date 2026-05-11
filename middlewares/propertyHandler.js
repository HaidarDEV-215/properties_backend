const {validationResult} = require('express-validator');
const httpStatusText = require('../utils/HTTP.status.text.js');
const appError = require('../utils/appError.js')
const fs = require ('fs');

const propertyValidationHandler = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        if(req.files && req.files.length>0){
            req.files.forEach(file => {
                //fs.unlink(`uploads/properties${file.filename}`,(err)=>{
                fs.unlink(file.path,(err)=>{
                    console.error(err);
                })
                //console.log("file deleted")
            });
        }
        const error = appError.create(errors.array(),400,httpStatusText.FAIL);
        return next(error);
    }
    next();
}

module.exports = {propertyValidationHandler}