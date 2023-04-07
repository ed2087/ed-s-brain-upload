//start routes
const express = require('express');
const router = express.Router();

//import controllers
const userController = require('../controllers/userControllers.js');


//routes
router.post('/appPage', userController.userPage);

router.post('/fetchAPI', userController.fetchAPIData);


//export
module.exports = router;