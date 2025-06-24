const bcrypt = require("bcrypt");

const knex = require("../db/knex");
const { createSession } = require("../utils/session");

const signIn = async (req, res) => {
  //email and password from frontend
  const { email, password } = req.body;

  try {
    //find hash first from login by using email
    const [data] = await knex("login")
      .select("email", "hash")
      .where({ email: email });

    //compare hash
    const isValid = bcrypt.compareSync(password, data.hash);

    if (isValid) {
      //get user if password is correct
      const [user] = await knex("users").select("*").where({ email: email });

      const token = await createSession(user);

      res.status(201).json({
        status: "success",
        data: { user, token },
      });
    } else {
      //if the password is wrong
      res.status(400).json("Wrong credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("unable to get user");
  }
};

module.exports = signIn;
