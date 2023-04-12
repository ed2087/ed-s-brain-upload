
sphereZize = 50;

//create birthday object

let userData = user;


//append question to chat
const appendQuestion = (question, images, user) => {

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

    let moldUlLi = appendImage(images, question) || ``;

    //if question dosent have contain p tag
    if(!question.includes("<p>")) question = `<p>${question}</p>`;

    let mold = `

        <div class="chat__question">

            <div class="chat__question__text">
                 <div class="${classN}" style="background:${color};">${firstLetter}</div> ${question}
            </div>

            ${moldUlLi}

        </div>
    `;

    canvas.innerHTML += mold;

    //focus on last question
    canvas.scrollTop = canvas.scrollHeight;

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


// text to speech
const textToSpeech = async (text) => {

    //unstable(true);
    
    //remove all p tags and replace with space and add to array
    let pTags = text.replace(/<p>/g, " ").replace(/<\/p>/g, " ");   


    let msg = new SpeechSynthesisUtterance();
    msg.text = pTags;     

    //set voice to Male make it sound more human
    msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google US English'; })[5];

    //set volume
    msg.volume = 1;

    //set rate
    msg.rate = 1.2;

    //set pitch
    msg.pitch = 1.2;

    window.speechSynthesis.speak(msg);   

    // stop unstable after speech is done
    // msg.onend = function(e) {
    //     unstable(false);
    // } 

};




//fetch conversations
const mainFunction = async (e) => {

    try {

        let question = _id("chat").value;

        //append question to chat
        appendQuestion(question, undefined, userData.name);
        

        //get data
        const data = await fetchQuestions('/fetchAPI', {
            question: question,
            user: userData
        });

        //if no data
        if(!data) return;

        allowBlob_function = true;
        unstable(true);

        setTimeout( async () => {

            const images = data[0].images || undefined;
            
            const randomAnswer = Math.floor(Math.random() * data.length);

            let question = data[randomAnswer].answer;         
            
            //remove white spaces from question
            question = question.trim();        

            question = await getFunctions(question);  
            
            //text to speech
            textToSpeech(question);
            
            //append answer to chat
            appendQuestion(question, images, "edgar"); 

            //clear input
            _id("chat").value = "";

        }, 500);
        
    } catch (error) {

        console.log(error);
        question = "something went wrong", error;
        appendQuestion(question, images, "edgar");
        
    }    

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


//check when user is typing
window.addEventListener("keypress", async (e) => {
    //only allow one per question
    if(allowBlob_function){
        allowBlob_function = false;
        unstable(false);
    }

});

//on load
window.addEventListener("load", () => {
    

        //warm up textToSpeech
        textToSpeech("");
        //welcome user
        appendQuestion(greeting(userData), undefined, "edgar");
    
});