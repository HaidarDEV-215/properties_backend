const express = require('express');
const usersControler = require('../controls/users.controler.js');
const verifyToken = require('../middlewares/verify.token.js');
const authorizeUserAction = require('../middlewares/authorizeCurrentUserAccountAction.js');
const httpStatusText = require('../utils/HTTP.status.text.js');
const router = express.Router();
const appError = require('../utils/appError.js');
const uploadUserImage = require('../helperFunctions/userImageUpload.js');//it uses multer

router.route('/')
            .get(verifyToken,usersControler.getAllUsers)

router.route('/register')
            .post(
                uploadUserImage.single('avatar'),//it uses multer
                usersControler.register
            )

router.route('/login')
            .post(usersControler.login)

router.route('/:userId')
            .delete(verifyToken,authorizeUserAction,usersControler.deleteAccount)
            .patch(verifyToken,authorizeUserAction,usersControler.updateAccountInfo)
            .get(verifyToken,usersControler.getSingleUserInfo);




module.exports = router;