const knex = require("../db/knex");

const profile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await knex.select("*").from("users").where({ id });
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json("not found!!!");
    }
  } catch (error) {
    res.status(400).json("error getting user");
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  try {
    const [user] = await knex("users")
      .where({ id })
      .update({ name, age })
      .returning("*");

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data or user not found",
    });
  }
};

module.exports = {
  profile,
  updateProfile,
};
