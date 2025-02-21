require('@dotenvx/dotenvx').config();
const express = require('express');
const bodyParse = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const pat = process.env.PAT;
const password = process.env.password;

const knex = require('knex')({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'saizayarhein',
      password: password,
      database: 'Smart-Brain',
    },
  });


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
    
    if(user){
        res.json(user);
    }else{
        res.status(404).json('not found');
    }
})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Insert user data
        const user = await knex('users').returning('*').insert({
            email: email,
            name: name,
            joined: new Date()
        });
        // Send response
        res.json(user[0]); // response contains inserted data, or just a success message
    } catch (error) {
        console.error(error);
        res.status(500).json('Error inserting user');
    }
});

//for future feature (not likely to happen tho lol)
app.get('/profile/:id', async(req,res) => {
    const {id} = req.params;

    try {
        const user = await knex.select('*').from('users').where({id});
        if(user.length){
            res.json(user[0]);
        }else{
            res.status(400).json('not found!!!');
        }
    } catch (error) {
        res.status(400).json('error getting user');
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
    console.log("app is running on port " + port);
})


/*
/--> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user 
 */