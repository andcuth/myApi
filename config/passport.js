var JwtStrategy = require('passport-jwt').Strategy; // set up jwt token strategy
var ExtractJwt = require('passport-jwt').ExtractJwt; //set up extract JWT

// load up the user model
var User = require('../models/user');
var config = require('./database'); // get db config file

module.exports = function(passport) {
    var opts = {};
    var jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: config.secret
    };

    passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, done){
        User.findOne({id:jwt_payload.id},function(err, user){
            if (err){
                return done(err, false);
            }
            if(user){
                done(null, user);
            } else{
                done(null,false);
            }
        });
    }));
};