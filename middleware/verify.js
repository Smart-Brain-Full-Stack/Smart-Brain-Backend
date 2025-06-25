const { client } = require("../utils/session");

const authVerify = async (req, res, next) => {
  try {
    const { jwt } = req.signedCookies;

    const id = await client.get(jwt);

    req.user_id = id;

    next();
  } catch (error) {
    res.status(401).send({ status: "fail", message: "Unauthorized" });
  }
};

module.exports = authVerify;
