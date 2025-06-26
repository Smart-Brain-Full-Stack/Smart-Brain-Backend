const knex = require("../db/knex");

const incrementEntries = async (req, res) => {
  const { id } = req.body;
  try {
    //get entries form users
    const [ent] = await knex("users")
      .where({ id: id })
      .increment("entries", 1) //increment by 1 every time we call it
      .returning("entries");

    res.status(200).json({
      status: "success",
      data: { entries: ent.entries },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error incrementing !!!");
  }
};

module.exports = incrementEntries;
