const appError = require("../utils/appError.js");
const httpStatus = require('../utils/HTTP.status.text.js');
const userRoles = require("../utils/userRoles.js")
const Report = require('../models/reports.model.js');

const authorizeAction = async (req,res,next)=>{
    const reportFromReqParams = await Report.findById(req.params.reportId);
    if(!reportFromReqParams){
        const error = appError.create("you are not allowed to do this action",403,httpStatus.FAIL);
        return next(error);
    }
    const currentUser = req.currentUser;
    if(currentUser.id == reportFromReqParams.user||currentUser.role ===userRoles.ADMIN){
        next();
    }
    else{
    const error = appError.create("you are not allowed to do this action",403,httpStatus.FAIL);
    return next(error);}
}

module.exports=authorizeAction;