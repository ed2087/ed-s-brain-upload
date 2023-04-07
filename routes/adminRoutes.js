const express = require('express');
const router = express.Router();

//import controllers
const userController = require('../controllers/adminController.js');

//import middleware
//const {ensureAuthenticated} = require('../middleware/auth.js');

//routes

router.get('/admin', userController.adminPage);

//create new user
router.post('/createUser', userController.createUser);

router.post('/newQuestion', userController.newQuestion);


//export
module.exports = router;