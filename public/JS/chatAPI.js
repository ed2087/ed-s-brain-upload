
const _id = (id) => document.getElementById(id);
const _class = (className) => document.getElementsByClassName(className);
const _classes = (className) => document.querySelectorAll(className);

//create birthday object

let userData = user;


let wifePersonalisedMessage = [
    "I love you",
    "I hope you have a great day",
    "You are the best"
];

// welcome user with a different type of greeting
const greeting = (user) => {

    let greeting = undefined;

    let today = new Date();
    let curHr = today.getHours();

    if (curHr < 12) {
        greeting = "Good morning";
    } else if (curHr < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    greeting += ` ${user.name}`;

    //check if permission == wife
    if(user.permission == "wife") greeting += ` ${wifePersonalisedMessage[Math.floor(Math.random() * wifePersonalisedMessage.length)]}`;

    return greeting;

};

console.log(userData);
//append question to chat
const appendQuestion = (question,user) => {

    const canvas = _id("chat_Board");
    
    //get first letter of user name
    const firstLetter = user.charAt(0).toUpperCase();

    let color = undefined;
    let classN = undefined;

    if(user == "edgar"){
        color = "blue";
        classN = "addMargin";
    }else {
        color = "green";
        classN = "";
    }

    let mold = `

        <div class="chat__question">

            <div class="chat__question__text">
                 <span class="${classN}" style="background:${color};">${firstLetter}</span> <p>${question}</p>
            </div>

        </div>
    `;

    canvas.innerHTML += mold;

    //focus on last question
    canvas.scrollTop = canvas.scrollHeight;

};


//check current Age

const replaceKeyWords = (question) => {

    let currentAge = undefined;
    let today = new Date();
    let birthDate = new Date("11/20/1987");
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    currentAge = age;

    //check if question containes ???? if so replace with current age
    if(question.includes("$age$")) question = question.replace("$age$", currentAge);

    //add user name if question contains $name$
    if(question.includes("$name$")) question = question.replace("$name$", userData.name);


    return question

};





//fetch questions
const fetchQuestions = async (url,data) => {

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const json = await response.json();

        return json;

        
    } catch (error) {
        console.log(error);
    }

};



//fetch conversations
const mainFunction = async (e) => {

    let question = _id("chat").value;

    //append question to chat
    appendQuestion(question, userData.name);

    //get data
    const data = await fetchQuestions('/fetchAPI', {
        question: question,
        user: userData
    });
    
    console.log(data);

    setTimeout(() => {

        //console.log(randomAnswer);
        //chhoose random answer
        const randomAnswer = Math.floor(Math.random() * data.length);

        let question = data[randomAnswer].answer;

        //check if question is asking about my age give them current age from 11/20/1987
        
        question = replaceKeyWords(question);
        
        //append answer to chat
        appendQuestion(question, "edgar"); 

    }, 500);

};



//check when user asks a question
_id("askButton").addEventListener("click", async (e) => {
    mainFunction(e);
});


//check when user presses enter
_id("chat").addEventListener("keyup", async (e) => {
    if (e.keyCode === 13) {
        mainFunction(e);
    }
});

//on load
window.addEventListener("load", () => {
    
        //welcome user
        appendQuestion(greeting(userData), "edgar");
    
});