//http://localhost:3000/admin?name=Edkiller2087&password=12345

//require flash
const flash = require('connect-flash');
//reuire hash
const bcrypt = require('bcryptjs');

// reuquest userModel
const UserModel = require('../models/userModel.js');
const ConversationModel = require('../models/conversation_model.js');

//require read and write json
const {readJson, writeJson, findByIdAndUpdate} = require('../utils/readAndWriteJSon.js');


//admin page
const adminPage_url = `/admin?name=${process.env.ADMIN_NAME}&password=${process.env.ADMIN_PASSWORD}`;


const flashAlert = (req, res, message) => {

    res.render('adminPage',{
        title: 'Admin Page',
        path: '/admin',
        alert: message
    })

}




exports.adminPage = (req, res) => {

    try {

        const {name, password} = req.query;

        let admiName = `${process.env.ADMIN_NAME}`;
        let admiPassword = `${process.env.ADMIN_PASSWORD}`;

        if(name === admiName && password === admiPassword) {

            res.render('adminPage', {
                title: 'Admin Page',
                path: '/admin',
                alert: null
            });

        } else res.redirect('/');
        
    } catch (error) {

        console.log(error);
        res.redirect('/');
        
    }   

    
};




//user creation
exports.createUser = async (req, res, next) => {

    try{  

         const {name, lastName, birthDate, password, verifyPassword, permissions} = req.body;      
        
         const usersData = await readJson('./JSON/users.json');
         

         //check if user already exists by checking name and lastName
         const exist = usersData.filter(user => user.name === name.toLowerCase() && user.lastName === lastName.toLowerCase());


         //check if passwords match
         if(password !== verifyPassword)return flashAlert(req, res, 'passwords do not match');         

         if(exist.length)return flashAlert(req, res, 'user already exists');

        
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        //set name and lastName to lowercase
        const nameLower = name.toLowerCase();
        const lastNameLower = lastName.toLowerCase();   
        
        //generate random id using the name and lastName and hash
        const id = await bcrypt.hash(`${nameLower}${lastNameLower}${hash}`, 10);

        //create user
        const userObj = {
            id: id,
            name: nameLower,
            lastName: lastNameLower,
            password: hash,
            permission: permissions,
            birthDate: birthDate
        };

        //write user to json file
        const user = await writeJson('./JSON/users.json', userObj);
       
       if(user)flashAlert(req, res, 'user created');

       else return flashAlert(req, res, 'user not created'); 

    }catch(error){  
        console.log(error);      
        flashAlert(req, res, error);
    };


};



// new question
exports.newQuestion = async (req, res, next) => {

    let {questions, alternative, answers, permissions} = req.body;

    //get image files
    const imageFiles = req.files;   

    //trim question and answer
    questions = questions.trim().toLowerCase();
    answers = answers.trim().toLowerCase();     

    try {

        const fileData = await readJson('./JSON/conversations.json');

        
        //check if question already exists or its close to an existing question
        const questionExist = fileData.filter(question => question.questions === questions);        
    
        if(questionExist.length > 0){            

            console.log('question already exists');
            
            //check in questionExist.answers object array if answer already exists
            const existAnswer = questionExist[0].answers.filter(answer => answer.answer === answers);
            console.log(existAnswer, " answer exist");
           

            if(existAnswer.length > 0){


                console.log('question and answer already exists');
                return flashAlert(req, res, 'question and answer already exists');
                

            }else{

                //merge alternative to existing alternative
                questionExist[0].alternative = questionExist[0].alternative.concat(alternative);
               
                // push new answer to answers arr in existAnswer
                questionExist[0].answers.push({
                    answer: answers,
                    images: imageFiles,
                    permission: permissions,
                    dateLastUsed: null,
                    numberOftimesUsed: 0
                });

                //send path id and data to update json file
                const id = questionExist[0].id;
                
                //update json file
                const updateFile = await findByIdAndUpdate('./JSON/conversations.json', id, questionExist[0]);
                
                if(updateFile)flashAlert(req, res, 'new answer added');
                console.log('new answer added');

            }          

        }else{            

            console.log('new question and answer');

            //generate random id using the question and answer
            const id = await bcrypt.hash(`${questions}${answers}`, 10);

            //if alternative is not an array
            if(!Array.isArray(alternative))alternative = [alternative];
            
            //create new question and answer
           const newQuestion = {
                id: id,
                questions: questions,
                alternative: alternative,
                answers: [{
                    answer: answers,
                    images: imageFiles,
                    permission : permissions,
                    dateLastUsed: null,
                    numberOftimesUsed: 0
                }]
            };

            // new test

            //write user to json file
            const finalFile = await writeJson('./JSON/conversations.json', newQuestion);

            if(finalFile)flashAlert(req, res, 'new question and answer added');

            else return flashAlert(req, res, 'new question and answer not added');

        }

    } catch (error) {

        console.log(error);
        flashAlert(req, res, error);
        
    }

};


