const {body} = require('express-validator');
const userRoles = require('../utils/userRoles.js');

userValidationSchema = ()=>{
    return([
        body('firstName')
            .notEmpty()
            .isLength({min:3,max:15})
            .withMessage("first name is required and must be bitween 3 and 15 character"),
        body('lastName')
            .notEmpty()
            .isLength({min:3,max:15})
            .withMessage("last name is required and must be bitween 3 and 15 character"),
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('invalid Email value'),
        body('password')
            .isString()
            .notEmpty()
            .withMessage('password cannot be empty')
            .isLength({min:8,max:16})
            .withMessage('password length must be bitween 8  and 16 character'),
        body('role')
            .default(userRoles.USER)
            .isIn([userRoles.ADMIN,userRoles.USER,userRoles.MANAGER])
            .withMessage(`invalid role value`),
        body('phone')
            .isString()
            .notEmpty()
            .withMessage('invalid phone number'),
        body('bio')
            .default(' ')
            .isLength({min:0,max:255})
            .withMessage("bio must be 255 character at most")
    ])
}

module.exports = {userValidationSchema};