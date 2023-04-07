//create a mongoose schema 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    
    //i want the user to be able to ask questions abut me and i want to be able to answer them depending the question if the user has permision to get that answer

    questions:{

        type: String,
        lowercase: true,       

    },

    answers: [],

    Permission: {
        type: String,
    },

});



//export our module to use in server.js
module.exports = mongoose.model('Conversation', ConversationSchema);