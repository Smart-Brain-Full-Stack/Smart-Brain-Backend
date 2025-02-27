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

app.get('/', (req,res) =>{
    res.json("Connected");
})

app.post('/signin' ,async (req,res)=> {
    //email and password from frontend
    const {email , password} = req.body;
    
    try {
        //find hash first from login by using email
        const [data] = await knex('login').select('email','hash').where({email:email});

        if(!data){
            res.status(400).json('User not found');
        }

        //compare hash
        const isValid = bcrypt.compareSync(password, data.hash);
    
        if(isValid){
            //get user if password is correct
            const [user] = await knex('users').select('*').where({email:email});
            res.json(user);
        }else{
            //if the password is wrong
            res.status(400).json('Wrong credentials');
        }

    } catch (error) {
        console.log(error);
        res.status(400).json('unable to get user');
    }
    
})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    //change password into hashcode
    const hash = bcrypt.hashSync(password,14);

    //we use trx when we have more than one operations
    knex.transaction(async trx => {
        try {

            //add to login
            const loginEmail = await trx('login').insert({
                email : email,
                hash: hash
            }); 

            //add to user
            const [user] = await trx('users').insert({
                email: email,
                name:name,
                joined: new Date()
            }).returning('*');

            // Commit transaction 
            //if we don't commit, this process will never stop and Data won’t be saved.
            await trx.commit();
            res.json(user);

        } catch (error) {
            await trx.rollback(); // Rollback if there's an error and  Errors won’t undo changes.
            console.error(error);
            res.status(500).json('Transaction failed');
        }        
    })

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

app.put('/image' , async(req,res)=>{
    const {id} = req.body;

    try {
        //get entries form users
       const [ent] = await knex('users')
       .where({ id: id })
       .increment('entries', 1) //increment by 1 every time we call it
       .returning('entries');

       res.json(ent);

    } catch (error) {
        console.error(error);
        res.status(500).json('Error incrementing !!!');
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