const {Router} = require('express');
const router = Router();

const knex = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    },
});

router.get('/' ,async(req,res) => {
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

module.exports = router;