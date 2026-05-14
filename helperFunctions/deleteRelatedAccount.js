const Propertie = require('../models/property.model.js');
const appError = require('../utils/appError.js');
const httpStatus = require('../utils/HTTP.status.text.js')

module.exports = async (req,res,next)=>{
        await Propertie.deleteMany({owner:req.currentUser.id});
        return true;
    }
