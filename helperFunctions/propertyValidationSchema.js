const{body} = require('express-validator');

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
    ])
}

module.exports = {propertyValiationSchema};