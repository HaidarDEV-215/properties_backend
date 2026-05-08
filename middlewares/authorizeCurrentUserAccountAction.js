const appError = require("../utils/appError.js");
const httpStatus = require('../utils/HTTP.status.text.js');
const userRoles = require("../utils/userRoles.js")

const authorizeAction = (req,res,next)=>{
    const userIdFromParams = req.params.userId;
    const currentUser = req.currentUser;
    if(currentUser.id === userIdFromParams||currentUser.role ===userRoles.ADMIN){
        next();
    }
    else{
    const error = appError.create("you are not allowed to do this action",403,httpStatus.FAIL);
    return next(error);}
}

module.exports=authorizeAction