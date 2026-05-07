//const httpStatusText = require('../utils/HTTP.status.text.js');
module.exports = (asyncFun)=>{
    return (req ,res,next)=>{
        asyncFun (req,res,next).catch((err)=>{
            next(err)
                // res.status(500).json({
                //     status:httpStatusText.ERROR,message:err.message,code:500,data:null
                // })
            
        })
    }
}


// module.exports = (asyncFunction)=>{
//     return (req,res,next)=>{
//         asyncFunction(req,res,next).catch((err)=>{
//             next(
//                 //the responce wz error 500
//             )
//         })
//     }
// }