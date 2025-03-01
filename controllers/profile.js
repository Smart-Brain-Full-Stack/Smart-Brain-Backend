const handleProfile = async(req,res,knex) => {
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
}

module.exports = {
    handleProfile : handleProfile
}