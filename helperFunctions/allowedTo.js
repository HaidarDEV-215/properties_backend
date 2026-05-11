const appError = require("../utils/appError.js");
const httpStatus = require('../utils/HTTP.status.text.js');

//pass roles to grant permission  to them
module.exports= (...roles)=>{//   ...[]  seperate barameters
    return (req,res,next)=>{
        //req.currentUser is difined in  ./verify.token.js  by request manipulation (adding the object attribute 'currentUser' to 'req' object)
        if(!roles.includes(req.currenUser.role)){//if passed roles includes currnet user role then continue, else throw an error
            const error = appError.create('you have no prmission to do this action',401,httpStatus.FAIL);
            return next(error);
        }
        next();
    }
}