const { ExtractJwt, Strategy } = require("passport-jwt");
const passport = require("passport");
const resourceManager = require("../resource-manager");
const RESOURCES_TYPES = require("../resource-manager/definitions");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      const user = await resourceManager.findById(
        RESOURCES_TYPES.USER,
        payload._id
      );
      if (user) {
        return done(null, user);
      } else {
        done(null, false, { message: "User not found" });
      }
    } catch (err) {
      done(err, false);
    }
  })
);

module.exports = passport;
