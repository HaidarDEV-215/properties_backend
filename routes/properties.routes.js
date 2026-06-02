const express = require('express');
const propertiesControls = require('../controls/properties.controler.js');
const router = express.Router();
const verifyOwnership = require('../middlewares/verifyPropertyOwnerShip.js');
const verifyToken = require('../middlewares/verify.token.js');
const authorizeUserAction = require('../middlewares/authorizeCurrentUserAccountAction.js');
const httpStatusText = require('../utils/HTTP.status.text.js');
const propertyImagesUpload = require('../helperFunctions/propertiesImagesUpload.js');//it uses multer
const {propertyValiationSchema} = require('../helperFunctions/propertyValidationSchema.js');
const {propertyValidationHandler} = require('../middlewares/propertyHandler.js')
const checkDailyPostLimit = require('../middlewares/checkDailyPostLimit.js');

router.route('/')
                .get(
                    verifyToken,
                    propertiesControls.getAllProperties)
                .post(
                    verifyToken,
                    propertyImagesUpload.array('images',10),//it uses multer
                    checkDailyPostLimit,
                    propertyValiationSchema(),
                    propertyValidationHandler,
                    propertiesControls.addProperty)

router.route('/my-liked')
                .get(
                    verifyToken,
                    propertiesControls.getMyLikes)

router.route('/like/:propertyId')
                .post(
                    verifyToken,
                    propertiesControls.addLike)
                .delete(
                    verifyToken,
                    propertiesControls.unlikeProperty)

router.route('/:propId')
                .get(
                    verifyToken,
                    propertiesControls.getSingleProperty)
                .delete(
                    verifyToken,
                    verifyOwnership,
                    propertiesControls.deleteProperty)
                .patch(
                    verifyToken,
                    verifyOwnership,
                    propertiesControls.updateProperty)

router.route('/users/my-properties')
                .get(
                    verifyToken,
                    propertiesControls.getMyProperties)

router.route('/users/search')
                .get(
                    verifyToken,
                    propertiesControls.propertiesSearch)

router.route('/user/:propId/:newStatus')
                .patch(
                    verifyToken,
                    verifyOwnership,
                    propertiesControls.changePropertyStatus
                )

module.exports = router;