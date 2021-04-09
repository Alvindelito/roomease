const User = require('../database/index');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy(async (username, password, done) => {
      try {
        let user = await User.findOne({ username: username }).exec();
        if (!user) return done(null, false);

        const match = await bcrypt.compare(password, user.password);
        if (match === true) {
          return done(null, user);
        } else {
          return done(null, false);
        }

      } catch(err) {
        throw err;
      }
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        username: user.username,
      };
      cb(err, userInformation);
    });
  });
};