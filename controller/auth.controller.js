const express = require("express");
const authController = express.Router();
const User = require("../database/model/user.model");
const asyncHandler = require("express-async-handler");

authController.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    console.log(req.body)
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({success: false, message: "No user found"});
    const correct = await user.checkPassword(password);
    if (!correct) return next(JSON.stringify({ message: "wrong password" }));
    const token = user.getJwtToken();
    res.status(200).json({ success: true, token });
  })
);

authController.post(
  "/signup",
  asyncHandler(async (req, res, next) => {
    const { username, password, email, fullname } = req.body;
    if (await User.count({username}) != 0 ||await User.count({email}) != 0) {
      return next(JSON.stringify({ message: "Such accounts already exists" }));
    }
    const newUser = await User.create({
      username,
      password,
      email,
      fullname,
    });
    const token = newUser.getJwtToken();
    res.status(200).json({ success: true, token });
  })
);

module.exports = authController;
