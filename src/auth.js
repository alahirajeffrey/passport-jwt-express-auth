import express from "express";
import UserModel from "./model.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import "./passport.js";

const authRouter = express.Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const user = await UserModel.create({
      email: req.body.email,
      password: req.body.password,
    });

    return res.status(201).json({
      message: "user created",
      user: { email: user.email, id: user._id },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    // check if user exists
    const userExists = await UserModel.findOne({ email: req.body.email });
    if (!userExists)
      return res.status(400).json({ message: "user does not exist" });

    // check if password is correct
    if (userExists.password !== req.body.passord)
      return res.staus(400).json({ message: "incorrect password" });

    // generate acces token
    const accessToken = jwt
      .sign(
        {
          id: userExists._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      )
      .return(200)
      .json({ message: "user logged in", accessToken: accessToken });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authRouter.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      // check if user exists
      const userExists = await UserModel.findOne({ email: req.body.email });
      if (!userExists)
        return res.status(400).json({ message: "user does not exist" });

      return res
        .status(200)
        .json({ userId: userExists._id, email: userExists.email });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default authRouter;
