const handleImage = async(req,res,knex) => {
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
}

module.exports = {
    handleImage : handleImage
}



