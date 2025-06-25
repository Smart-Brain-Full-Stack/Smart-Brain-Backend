const signIn = require("../controllers/signin");
const register = require("../controllers/register");
const detectFace = require("../controllers/detect");
const { profile, updateProfile } = require("../controllers/profile");
const incrementEntries = require("../controllers/image");

const { Router } = require("express");
const authVerify = require("../middleware/verify");
const signout = require("../controllers/signout");
const router = Router();

router.post("/signin", signIn);
router.post("/register", register);
router.post("/signout", signout);
router.post("/detect-face", authVerify, detectFace);
router.get("/profile/me", authVerify, profile);
router.put("/profile/:id", authVerify, updateProfile);
router.put("/image", authVerify, incrementEntries);

module.exports = router;
