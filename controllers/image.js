const {Router} = require('express');
const router = Router();

const knex = require('../knex/knex');

router.put('/' ,async(req,res) => {
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

module.exports = router;



