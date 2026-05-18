const express = require('express');
const reportsControls = require('../controls/reports.controler.js');
const verifyToken = require('../middlewares/verify.token.js');
const authorizeUserAction = require('../middlewares/authorizeCurrentUserAccountAction.js');
const router = express.Router();
const allowedTo = require('../helperFunctions/allowedTo.js');
const userRoles = require('../utils/userRoles.js');
const validateReportDisplay = require('../middlewares/validateUserReportDisplay.js');

router.route('/')
            .get(
                verifyToken,
                allowedTo(userRoles.ADMIN),
                reportsControls.getAllReports)
            .post(
                verifyToken,
                reportsControls.createReport)

router.route('/:reportId')
            .get(
                verifyToken,
                validateReportDisplay,
                reportsControls.getOneReport)
            .patch(
                verifyToken,
                validateReportDisplay,
                reportsControls.updateReportTitle)
            .delete(
                verifyToken,
                validateReportDisplay,
                reportsControls.deleteReport)

module.exports = router;