const jwt = require("jsonwebtoken");
const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL,
});

client.connect().catch(console.error);

const createSession = async (user) => {
  const { email, id } = user;

  const token = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  await client.set(token, id);

  return token;
};

module.exports = {
  createSession,
  client,
};
