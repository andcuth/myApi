var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Book = require("../models/films");

router.post('/signup', function(req, res){
    if (!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password'});
    } else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password


        });
        ///save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists'});
            }
            res.json({success: true, msg: 'Successfully created new user'});
        });
    }
});

router.post('/signin', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            //check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    //if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON, config.secret);
                    //return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

