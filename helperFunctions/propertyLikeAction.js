const appError = require('../utils/appError.js');
const Like = require('../models/likes.model.js');

module.exports = async(req,res,next,property,choice)=>{
    //console.log('enter like action');
    const user = req.currentUser.id;
    const propertyId = property._id;
    if(choice == 'like'){
        //console.log('give like');        
        const oldLike = await Like.findOne({user:user,property:propertyId});
        //console.log('old',oldLike);        
        if(!oldLike){
            console.log('add to mode like');
            
            const newLike = new Like({
                user:user,
                property:propertyId,
                date:Date.now().toFixed()
            });
            await newLike.save();
            property.likes +=1;
        }
    }
    else{
        const oldLike = await Like.findOne({user:user,property:propertyId});
        //console.log(oldLike);
        if(oldLike){
            await Like.deleteOne({user:user,property:propertyId});
            property.likes -=1;
        }
    }
    return property;
}
