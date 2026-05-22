const Propertie = require('../models/property.model.js');
const httpStatus = require('../utils/HTTP.status.text.js');
const appError = require('../utils/appError.js');

module.exports = async(propertiesIds)=>{
    const properties = await Propertie.find({_id:{
        $in:propertiesIds
    }});
    return properties;
}