//reuire hash
const bcrypt = require('bcryptjs');

const stringSimilarity = require('string-similarity');

//SentenceSimilarity
const similarity  = require('sentence-similarity');
const similarityScore = require('similarity-score');

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


        //if name admin and password is correct direct to admin page
        if(name === process.env.ADMIN_NAME && password === process.env.ADMIN_PASSWORD){
            res.redirect(`/admin?name=${process.env.ADMIN_NAME}&password=${process.env.ADMIN_PASSWORD}`);
            return;
        }

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



//check similarity

const similarity_fun = async (question, conversations, typeSearch) => {

    let winkOpts = { f: similarityScore.winklerMetaphone, options : {threshold: 0} }

    //wrap question in array
    let questionArray = [question];

    //find similar questions
    if(typeSearch == "question"){
        return conversations.find(conversation => similarity(questionArray, [conversation.questions], winkOpts).score > 0.5);
    }else{
        return conversations.find(conversation => conversation.alternative.find(alternative => similarity(questionArray, [alternative], winkOpts).score > 0.5));
    }
    
};


exports.fetchAPIData = async (req, res, next) => {

    let {question, user} = req.body;

    try { 

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

            // //find similar questions
            // let similarQuestion = await similarity_fun(question, conversations, "question");                 
           
            // //check in alternative         
            // let alternativeQuestion = await similarity_fun(question, conversations, "alternative");          
            
            let similarQuestion = conversations.find(conversation => stringSimilarity.compareTwoStrings(conversation.questions, question) > 0.7);   
            let alternativeQuestion = conversations.find(conversation => conversation.alternative.find(alternative => stringSimilarity.compareTwoStrings(alternative, question) > 0.7));
   
            
            let payLoad = [];
            let checkIfLoopStoped = 0;

            
            if(similarQuestion || alternativeQuestion) {

                similarQuestion = similarQuestion || alternativeQuestion;  

                //if permission is granted build payload        
                similarQuestion.answers.forEach(answer => {
                        
                        //check if user has permission to view the answer
                        //if brother or wife or kids give access to family answers

                        let familyPerm = ['brother', 'wife', 'kids', "jennifer", "caitlynn","jazlynn","edgar","cynthia","omar","daniel","gabriel"];

                        let kidsPerm = ['jennifer', 'caitlynn','jazlynn', 'edgar'];

                        console.log(user.permission)
                        if(familyPerm.includes(user.permission) && answer.permission === 'family' ||
                            answer.permission === 'all' ||
                                 answer.permission === user.permission ||
                                    kidsPerm.includes(user.permission) && answer.permission === 'kids') {
                
                            //build payload
                            payLoad.push({
                                answer: answer.answer,
                                images: answer.images,
                                dateLastUsed: answer.dateLastUsed,
                                permission: answer.permission
                            }); 

                            //give answer date for when the answer was given dateLastUsed and save to json
                            answer.dateLastUsed = new Date().toLocaleDateString();   
                            
                            //add numberOftimesUsed to answer
                            answer.numberOftimesUsed += 1;
                            
                            checkIfLoopStoped += 1;
                        }


                });

                //if user doesn't have permission to view the answer
                if(checkIfLoopStoped === 0) {
                    //check for end of loop
                    payLoad.push({
                        answer: "You don't have permission to view this answer",
                        images: [],
                        dateLastUsed: new Date().toLocaleDateString(),
                        permission: 'all'
                    });

                }; 

                //save to json
                await findByIdAndUpdate(conversationModelPath, similarQuestion.id, similarQuestion);

            }else {

                //build payload
                payLoad.push({                    
                        answer: "There is no answer to that question in my head",
                        images: [],
                        dateLastUsed: new Date().toLocaleDateString(),
                        permission: 'all'
                });

            };
            
            //send payload
            res.json(payLoad);

    } catch (error) {

        console.log(error);
        //build error payload
        const payLoad = [
            {

                answer: 'Something went wrong, please try again'

            }
        ];

        //send payload
        res.json(payLoad);        
            
    };

};






//let similarQuestion = conversations.find(conversation => stringSimilarity.compareTwoStrings(conversation.questions, question) > 0.7);   
//let alternativeQuestion = conversations.find(conversation => conversation.alternative.find(alternative => stringSimilarity.compareTwoStrings(alternative, question) > 0.7));
        