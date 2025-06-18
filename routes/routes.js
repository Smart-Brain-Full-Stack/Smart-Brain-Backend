const signIn = require("../controllers/signin");
const register = require("../controllers/register");
const detectFace = require("../controllers/detect");
const profile = require("../controllers/profile");
const incrementEntries = require("../controllers/image");

const { Router } = require("express");
const router = Router();

router.post("/signin", signIn);
router.post("/register", register);
router.post("/detect-face", detectFace);
router.get("/profile/:id", profile);
router.put("/image", incrementEntries);

module.exports = router;
