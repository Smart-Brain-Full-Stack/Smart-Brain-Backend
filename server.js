require("@dotenvx/dotenvx").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT;

//app.use(morgan("combined"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Connected");
});

app.use("/api", routes);

app.listen(port || 3000, () => {
  console.log("app is running on port " + port);
});

/*
/--> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user 
 */
