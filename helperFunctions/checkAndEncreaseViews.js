const View = require('../models/views.model.js');

module.exports = async(req,res,next)=>{
    const currentUserId = req.currentUser.id;
    const propertyId = req.params.propId;
    const oldView = await View.findOne({user:currentUserId,property:propertyId});
    if(!oldView){
        const newView = new View({
            user:currentUserId,
            property:propertyId,
            date:Date.now()
        });
        await newView.save();
        return true;
    }
    return false;
}