const express = require('express');
const router = express.Router();
const passwordControls = require('../controls/password.controler.js');
const verifyToken = require('../middlewares/verify.token.js');

router.route('/')
        .post(
            passwordControls.resetPasswordRequest);

router.route('/email_verification')
        .post(
            passwordControls.confirmOTP);

router.route('/reset_password')
        .patch(
            verifyToken,
            passwordControls.resetUserPassword);

module.exports = router;