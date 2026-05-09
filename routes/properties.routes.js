const express = require('express');
const propertiesControls = require('../controls/properties.controler.js');
const router = express.Router();
const verifyOwnership = require('../middlewares/verifyPropertyOwnerShip.js');
const verifyToken = require('../middlewares/verify.token.js');
const authorizeUserAction = require('../middlewares/authorizeCurrentUserAccountAction.js');
const httpStatusText = require('../utils/HTTP.status.text.js');

router.route('/')
                .get(verifyToken,propertiesControls.getAllProperties)
                .post(verifyToken,propertiesControls.addProperty)

router.route('/:propId')
                .get(verifyToken,propertiesControls.getSingleProperty)
                .delete(verifyToken,verifyOwnership,propertiesControls.deleteProperty)
                .patch(verifyToken,verifyOwnership,propertiesControls.updateProperty)

router.route('/users/my-properties')
                .get(verifyToken,propertiesControls.getMyProperties)

router.route('/users/search')
                .get(verifyToken,propertiesControls.propertiesSearch)

module.exports = router;