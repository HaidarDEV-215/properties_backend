const fs = require("fs");
const appError = require("../utils/appError.js");
const httpStatusText = require("../utils/HTTP.status.text.js");
const { log } = require("console");

let imagedeleted = false;

const rejectedUserImageCleaner = (req,res,next)=>{
    if(req.file){
        fs.unlink(req.file.path,()=>{
            if (err){
                const error = appError.create(`error while deleting user image`,500,httpStatusText.FAIL);
                return next(error);
            }
        })
    }
    return true;
}

const deletedUserImageCleaner = (imagePath,next)=>{
    fs.unlink(imagePath,(err)=>{
        if(err){
            const error = appError.create(`error while deleting user image`,500,httpStatusText.FAIL);
            return next(error);
        }
    })
    return true;
}

const rejectedPropertyImagesCleaner = (req,res,next)=>{
    if(req.files && req.files.length>0){
        req.files.forEach(file => {
            fs.unlink(file.path,(err)=>{
                if(err){
                    const error = appError.create(`error while deleting property image`,500,httpStatusText.FAIL);
                    return next(error);
                }
            })
        });
    }
    return true;
}

const deletedPropertyImagesCleaner = (imagePaths,next)=>{
    imagePaths.forEach(path => {
        fs.unlink(path,(err)=>{
            if(err){
                const error = appError.create(`error while deleting property image`,500,httpStatusText.FAIL);
                return next(error);
            }
        })
    });
    return true;
}

module.exports = {
    rejectedUserImageCleaner,
    rejectedPropertyImagesCleaner,
    deletedPropertyImagesCleaner,
    deletedUserImageCleaner
}