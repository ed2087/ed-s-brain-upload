const express = require('express');
const router = express.Router();

//import controllers
const userController = require('../controllers/adminController.js');

//import readAndWriteJson
const upload = require('../utils/imageUpload.js');

//routes
router.get('/admin', userController.adminPage);

//create new user
router.post('/createUser', userController.createUser);

router.post('/newQuestion', upload.array("files"), userController.newQuestion);


//export
module.exports = router;