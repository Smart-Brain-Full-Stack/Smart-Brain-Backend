const {Router} = require('express');
const router = Router();
const bcrypt = require('bcrypt');

const knex = require('../knex/knex');

router.post('/',async(req,res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        res.status(400).json("Could not reigster !!!");
        return;
    }

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
})

module.exports = router;