const signout = async (req, res) => {
  try {
    res.clearCookie("jwt");

    res
      .status(200)
      .json({ status: "success", message: "Signed out successfully!" });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Something went wrong." });
  }
};

module.exports = signout;
