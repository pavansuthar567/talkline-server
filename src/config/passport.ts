import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { IUser, UserModel } from "../models/user"; // Adjust the path to your User model
import dotenv from "dotenv";
import passport from "passport";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });
export const JWT_SECRET = process.env.JWT_SECRET;

const opts: any = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET, // Ensure to set this in your environment variables
};

const passportConfig = (passport: passport.PassportStatic) => {
  passport.use(
    new JwtStrategy(opts, async (jwtPayload: any, done: any) => {
      try {
        const user = await UserModel.findById(jwtPayload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

export default passportConfig;
