const express = require('express');
const bodyParse = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('@dotenvx/dotenvx').config()

const app = express();
const port = process.env.PORT;
const pat = process.env.PAT;

app.use(bodyParse.json());
app.use(cors());
  
//CLARIFAI API VERY IMPORTANT
const returnClarifaiRequestOptions = function (img) {
    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = pat;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = "8rbi0vcpvzmz";
    const APP_ID = "test";
  
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = "face-detection";
    const IMAGE_URL = img;
  
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    });
  
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };
  
    return requestOptions;
  };

  app.post("/detect-face", async (req, res) => {
    try {
        const  {imageUrl} = req.body;

        const response = await fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`,
         returnClarifaiRequestOptions(imageUrl))

        const result = await response.json();

        if (!result.outputs) {
            return res.status(400).json({ error: "Failed to fetch data from Clarifai" });
        }
        res.json(result);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
  })
  


const database = {
    users : [
        {
            id: '123',
            name: 'Slade',
            email: 'gg@gmail.com',
            password: 'cookies',
            entries : 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sai',
            email: 'ggez@gmail.com',
            password: 'cookme',
            entries : 0,
            joined: new Date()
        }
    ],
    login : [
        {
            id: '123',
            hash: '',
            email: 'gg@gmail.com'
        }
    ]
} 

app.get('/', (req,res) =>{
    res.send(database.users);
})

app.post('/signin' ,(req,res)=> {
    const {email , password} = req.body;
    
    const user = database.users.find(user => user.email === email && user.password === password);
    console.log(user);

    if(user){
        res.json(user);
    }else{
        res.status(404).json('not found');
    }
})

app.post('/register' , (req,res)=>{
    const {name,email,password} = req.body;
    if(name && email && password){
        database.users.push({
            id: '125',
            name: name,
            email: email,
            password: password,
            entries : 0,
            joined: new Date()
        })
        res.json(database.users[database.users.length-1]);
    }else{
        res.status(400).json('error registering acc');
    }
})

app.get('/profile/:id', (req,res) => {
    const {id} = req.params;

    const user = database.users.find(user => user.id === id);
 
    if(user){
        res.json(user);
    }else{
        res.status(404).json('not found');
    }
})

app.put('/image' , (req,res)=>{
    const {id} = req.body;

    const user = database.users.find(user => user.id === id);

    if(user){
        user.entries++;
        res.json(user.entries);
    }else{
        res.status(404).json('not found');
    }
})

app.listen(port , ()=>{
    console.log("app is running on port 3000");
})


/*
/--> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user 
 */