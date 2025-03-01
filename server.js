require('@dotenvx/dotenvx').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const password = process.env.password;

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const detect = require('./controllers/detect');

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


app.use(express.json());
app.use(cors());
  


app.post("/detect-face",  (req, res) => {
    detect.handleDetect(req,res);
})

app.get('/', (req,res) =>{
    res.send("Connected");
})

app.post('/signin' , (req,res)=> {
    signin.handleSignin(req,res,knex,bcrypt);
})

app.post('/register',  (req, res) => {
    register.handleRegister(req,res,knex,bcrypt);
});

//for future feature (not likely to happen tho lol)
app.get('/profile/:id', (req,res) => {
    profile.handleProfile(req,res,knex);
})


app.put('/image' , (req,res)=>{
    image.handleImage(req,res,knex);
})

app.listen(port || 3000 , ()=>{
    console.log("app is running on port " + port);
})



/*
/--> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user 
 */
