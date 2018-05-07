const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    //เข้่าสู่ระบบสำเร็จ
                    if(user) {
                        return done(null, user)
                    }
                    //ถ้าไม่พบ user ในระบบ
                    return done(null, false)
                })
                .catch(err => console.log(err))
        })
    );
};