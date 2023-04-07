//reuire hash
const bcrypt = require('bcryptjs');
const stringSimilarity = require('string-similarity');

//require read and write json
const {readJson, writeJson, findByIdAndUpdate} = require('../utils/readAndWriteJSon.js');

const userModelPath = './JSON/users.json';
const conversationModelPath = './JSON/conversations.json';


//render homepage 
const homepage = (req, res, error) => {

    res.render('index', {
        title: 'Home Page',
        path: '/',
        alert: error,
    });

};

//user Page
const userPage = async (req, res, user, error) => {

    res.render('appPage', {
        title: 'Chat With Edgar',
        path: '/appPage',
        user: user,
        alert: error
    });

};



// appPage
exports.userPage = async (req, res, next) => {

    try {

        let {name, password} = req.body;

        //trim name and password and convert to lowercase
        name = name.trim().toLowerCase();
        password = password.trim();

        //check if user exists
        const user = await readJson(userModelPath);

        let checkIfUser_hasAccess = false;
        //compare password  to user password
        user.forEach(user => {

            const match = bcrypt.compareSync(password, user.password);

            let fullName = user.firstName + ' ' + user.lastName;

            //if name and password match
            if(user.name === name && match || fullName === name && match) {

                // remove password from _id
                delete user.password;
                delete user.id;

                //sesnd user to appPage
                userPage(req, res, user, null);

                checkIfUser_hasAccess = true;
                
            }

        });

        //if user doesn't have access
        if(!checkIfUser_hasAccess) homepage(req, res, 'Wrong username or password');
        
    } catch (error) {

        console.log(error);
        res.redirect('/');
        
    }


};



exports.fetchAPIData = async (req, res, next) => {

    let {question, user} = req.body;

    //lowercase question and trim
    question = question.trim().toLowerCase();

    //if question is empty return
    if(question === ''){
        //send payload
        res.json([
            {
                //please ask a question
                answer: 'please ask a question'
            }
        ]);

        return;
    };

    //read conversations
    const conversations = await readJson(conversationModelPath);

    // check if question exists or any that are similar using stringSimilarity
    let similarQuestion = conversations.find(conversation => stringSimilarity.compareTwoStrings(conversation.questions, question) > 0.6);   

    //check in alternative array if questions and see if question in there are similar using stringSimilarity
    const alternativeQuestion = conversations.find(conversation => conversation.alternative.find(alternative => stringSimilarity.compareTwoStrings(alternative, question) > 0.6));
 
    
    let payLoad = [];
    //if similarQuestion exists
    if(similarQuestion || alternativeQuestion) {

        similarQuestion = similarQuestion || alternativeQuestion;

        //if permission is granted build payload        
        similarQuestion.answers.forEach(answer => {
                
                //check if user has permission to view the answer
                //if brother or wife or kids give access to family answers

                let familyPerm = ['brother', 'wife', 'kids'];

                if(familyPerm.includes(user.permission) && answer.permission === 'family' || answer.permission === 'all' || answer.permission === user.permission) {
        
                    //build payload
                    payLoad.push({
                        answer: answer.answer
                    }); 
        
                }
        
        });

    }else {

        //build payload
        payLoad.push(
            {
                answer: "There is no answer to that question in my head"
            },
            {
                answer: "The time available in a lifetime isn't enough to answer all of your questions"
            },
            {
                answer: "To that question, I have no answer"
            },
            {
                answer: "I don't know"
            }
        );

    };

    //send payload
    res.json(payLoad);

};