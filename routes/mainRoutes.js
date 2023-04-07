const express = require('express');
const router = express.Router();

//import controllers
const userController = require('../controllers/mainControllers.js');

//import middleware
//const {ensureAuthenticated} = require('../middleware/auth.js');

//routes
router.get('/', userController.homepage);


//export
module.exports = router;