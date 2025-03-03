const {Router} = require('express');
const router = Router();
const bcrypt = require('bcrypt');

const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    },
});

router.post('/',async(req,res) => {
    //email and password from frontend
    const {email , password} = req.body;
    
    try {
        //find hash first from login by using email
        const [data] = await knex('login').select('email','hash').where({email:email});

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

module.exports = router;
