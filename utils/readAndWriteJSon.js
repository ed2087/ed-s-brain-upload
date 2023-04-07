//require fs module
const fs = require('fs');

//read a json file and return the object
const readJson = async (path) => {

    
    const data = fs.readFileSync(path, 'utf8', (err, data) => {
            
            if(err) throw err;
    
            return data;   
    });
    
    return JSON.parse(data);

};


//write a json file

const writeJson = async (path, data) => {
   
    //convert object to string
    const dataString = JSON.stringify(data);

    //read file
    const read = fs.readFileSync(path, 'utf8', (err, data) => {
        
        if(err) throw err;

        return data;   
    });

    //parse file
    const parse = JSON.parse(read);

    //push new data to users array
    parse.push(data);

    //convert object to string
    const dataString_ = JSON.stringify(parse);

    //write file
    const write = fs.writeFileSync(path, dataString_, (err) => {
        
        if(err) throw err;

        return true;   
    });

    return true;
    

};


//find by id and update
const findByIdAndUpdate = async (path, id, data) => {
   
    //read file
    const read = fs.readFileSync(path, 'utf8', (err, data) => {
        
        if(err) throw err;

        return data;   
    }); 
    
    //parse file
    const parse = JSON.parse(read);

    //find index of user
    const index = parse.findIndex(user => user.id === id);

    //update user
    parse[index] = data;

    //convert object to string
    const dataString_ = JSON.stringify(parse);

    //write file

    const write = fs.writeFileSync(path, dataString_, (err) => {
        
        if(err) throw err;

        return true;   
    });

    return true;


};

module.exports = {readJson, writeJson, findByIdAndUpdate};