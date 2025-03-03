const {Router} = require('express');
const router = Router();

const knex = require('../knex/knex');

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