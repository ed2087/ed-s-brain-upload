const appendImage = (images, title) => {    

    //if undefined return
    if(images === undefined) return;

    //if images aray is empty return
    if(images.length === 0) return;

    //loop images and create li and img
    let img = ``;

    //check if mimetype is image or video or audio or txt

    let imageMimeTypes = images[0].mimetype;
    //get only name
    let imageName = images[0].originalname;

    if(imageMimeTypes === 'image/jpg' || imageMimeTypes === 'image/jpeg' || imageMimeTypes === 'image/png' || imageMimeTypes === 'image/gif' || imageMimeTypes === 'image/svg+xml'){
        //create image
        images.forEach(image => {

            image = `../../IMAGES/${image.filename}`;
            
            img += `<li><img src="${image}" alt="${title}"></li>`;
        });

    }else if(imageMimeTypes === 'video/mp4' || imageMimeTypes === 'video/ogg' || imageMimeTypes === 'video/webm'){

        //create video
        images.forEach(image => {

            image = `../../VIDEOS/${image.filename}`;

            img += `<li><video src="${image}" controls></video></li>`;

        });

    }else if(imageMimeTypes === 'audio/mpeg'){

        //create audio

        images.forEach(image => {

            image = `../../AUDIOS/${image.filename}`;

            img += `<li><audio src="${image}" controls></audio></li>`;

        });

    }else if(imageMimeTypes === 'text/plain'){

        //create txt

        images.forEach(image => {

            image = `../../DOCUMENTS/${image.filename}`;           

            // allow download
            img += `<li><a href="${image}" download>Download -- ${imageName}</a></li>`;
        });

        
    }

    //add in side wrapper
    return `
        <div class="chat__question__images">
            <ul>
                ${img}
            </ul>
        </div>
    `    
    
};

const findLinks = (question) => {    

    //find links
    let link = question.match(/(https?:\/\/[^\s]+)/g);
    let linkMold = undefined;

    //if link is not empty
    if(link != null){

        //loop through links
        link.forEach(link => {

            //only get name of link
            const linkName = link.split("/")[2];
            
            //if link is youtube imbed link
            if(link.includes("youtu.be") || link.includes("youtube.com/embed/")){

                //replace https://youtu.be with https://youtube.com/embed/
                let link_clone = link.replace("youtu.be", "youtube.com/embed/");
                
                //create link
                linkMold = `<iframe width="560" height="315" src="${link_clone}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                
                //replace link with linkMold
                question = question.replace(link, linkMold);

            }else{          

                
                //create link
                linkMold = `<a href="${link}" target="_blank">${linkName}</a>`;

                //replace link with linkMold
                question = question.replace(link, linkMold);
                
            }

        });

    }

    return question;

};

//find list of items that start with ( and end with )
const findList = (question) => {

    //find list
    let list = question.match(/\(([^)]+)\)/g);

    //if list is not empty
    if(list != null){

        //loop through list
        list.forEach(list => {

            //remove ( and )
            list = list.replace("(", "");
            list = list.replace(")", "");

            //split list by ,
            list = list.split(",");

            //create list
            let listMold = `<ul>`;

            //loop through list
            list.forEach(list => {

                //add list item
                listMold += `<li>${list}</li>`;

            });

            //close list
            listMold += `</ul>`;

            //find text that is not in p tags or a tags or ul tags
            let text = question.match(/(?<=<p>)(.*?)(?=<\/p>)|(?<=<a>)(.*?)(?=<\/a>)|(?<=<ul>)(.*?)(?=<\/ul>)/g);

            
            //replace list with listMold
            question = question.replace(`(${list})`, listMold);

        });

    }

    return question;


};



//check current Age
const myCurrAgeFun = (question) => {

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


    return question

};


const nameFun = (question) => question = question.replace("$name$", userData.name);

// check for ptag by checking for  $ptag$ at the beginning and end of the string
const ptagFun = (question) => {

    //check if question containes $ptag$ at the beginning and end of the string and replace with p tag
    if(question.startsWith("$ptag$") && question.endsWith("$ptag$")){
        question = question.replace("$ptag$", "<p>");
        question = question.replace("$ptag$", "</p>");
        question = `<p>${question}</p>`;
    }

    return question;

};

//remove any empty elements from string






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
    if(user.permission == "wife") greeting = `<p>${greeting} ${wifePersonalisedMessage[Math.floor(Math.random() * wifePersonalisedMessage.length)]}</p>`;


    return greeting;

};





// get all functions
const getFunctions = async (question, title) => {

    // add exept appendImage
    let functions = [myCurrAgeFun, nameFun, findLinks, findList];

    //loop through functions
    functions.forEach(func => {
            
            //run function
            question = func(question, title);
    
    });

    //return question
    return question;


};