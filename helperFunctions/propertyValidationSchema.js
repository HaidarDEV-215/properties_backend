const{body} = require('express-validator');
const { isIn } = require('validator');

const propertyValiationSchema = ()=>{
    return ([
        body('price')
            .notEmpty()
            .isNumeric()
            .isInt({gt:0})
            .withMessage('property price cannot be empty or nigative value'),
        body('area')
            .notEmpty()
            .isNumeric()
            .isInt({gt:0})
            .withMessage('property area cannot be empty or nigative value'),
        body('title')
            .notEmpty()
            .withMessage('title cannot be empty')
            .isLength({min:5,max:255})
            .withMessage('title length must be between 5 and 255 character'),
        body('description')
            .isLength({max:255})
            .withMessage('description length must be 255 character at most'),
        body('purpose')
            .isString()
            .notEmpty()
            .withMessage('purpose cannot be empty and must be string')
            .isIn(['rent','sell'])
            .withMessage("purpose invalid try [rent,sell]"),
        body('category')
            .isString()
            .notEmpty()
            .withMessage('category cannot be empty and must be string')
            .isIn(['apartment','house','land','office','shop','land'])
            .withMessage("category invalid try [apartment,house,land,office,shop,land]"),
        body('city')
            .isString()
            .notEmpty()
            .withMessage('city cannot be empty and must be string'),
        body('status')
            .default('available')
            .isIn(['available','sold','rented'])
            .withMessage("status invalid try [available,sold,rented]"),
        body('address')
            .notEmpty()
            .withMessage('address cannot be empty'),
        body('lat')
            .optional()
            .isFloat({min:-90,max:90})
            .withMessage('latitude must be between -90 and 90'),
        body('lng')
            .optional()
            .isFloat({min:-180,max:180})
            .withMessage('longitude must be between -180 and 180'),
        body('bathRooms')
            .optional()
            .isNumeric()
            .isInt({gt:0})
            .withMessage('bathRooms must be a positive integer'),
        body('bedRooms')
            .optional()
            .isNumeric()
            .isInt({gt:0})
            .withMessage('bedRooms must be a positive integer')
    ])
}

module.exports = {propertyValiationSchema};