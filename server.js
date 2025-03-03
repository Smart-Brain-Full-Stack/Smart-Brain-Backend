require('@dotenvx/dotenvx').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const password = process.env.password;

const signinRoutes = require('./controllers/signin');
const registerRoutes = require('./controllers/register');
const profileRoutes = require('./controllers/profile');
const imageRoutes = require('./controllers/image');
const detectRoutes = require('./controllers/detect');

app.use(express.json());
app.use(cors());

    //   host: '127.0.0.1',
    //   port: 5432,
    //   user: 'saizayarhein',
    //   password: password,
    //   database: 'Smart-Brain',

app.use("/detect-face", detectRoutes)

app.get('/', (req,res) =>{
    res.send("Connected");
})

app.use('/signin',signinRoutes);

app.use('/register', registerRoutes);

//for future feature (not likely to happen tho lol)
app.use('/profile/:id', profileRoutes);

app.use('/image' , imageRoutes);

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
