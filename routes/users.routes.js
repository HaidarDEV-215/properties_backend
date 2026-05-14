const express = require('express');
const usersControler = require('../controls/users.controler.js');
const verifyToken = require('../middlewares/verify.token.js');
const authorizeUserAction = require('../middlewares/authorizeCurrentUserAccountAction.js');
const httpStatusText = require('../utils/HTTP.status.text.js');
const router = express.Router();
const appError = require('../utils/appError.js');
const uploadUserImage = require('../helperFunctions/userImageUpload.js');//it uses multer
const {userValidationHandler} = require('../middlewares/userValidationHandler.js');
const {userValidationSchema} = require('../helperFunctions/userValidationSchema.js');

router.route('/')
            .get(
                verifyToken,
                usersControler.getAllUsers)

router.route('/register')
            .post(
                uploadUserImage.single('avatar'),//it uses multer
                userValidationSchema(),
                userValidationHandler,
                usersControler.register)

router.route('/login')
            .post(
                usersControler.login)

router.route('/:userId')
            .delete(
                verifyToken,
                authorizeUserAction,
                usersControler.deleteAccount)
            .patch(
                verifyToken,
                authorizeUserAction,
                usersControler.updateAccountInfo)
            .get(
                verifyToken,
                usersControler.getSingleUserInfo);

router.route('/updateAvatar/:userId')
            .patch(verifyToken,
                uploadUserImage.single('avatar'),
                authorizeUserAction,
                usersControler.updateUserAvatar);


module.exports = router;