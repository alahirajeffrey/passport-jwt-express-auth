import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import UserModel from "./model.js";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "hello",
};

passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.id);
      if (user) return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);
// export default passport;
