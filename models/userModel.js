//create a user model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
    },
    password : {
        type: String,
        required: true,
        lowercase: true,
    },
    permission: {
        type: String,
        required: true,
    }

});

//export our module to use in server.js
//module.exports = mongoose.model('User', UserSchema);