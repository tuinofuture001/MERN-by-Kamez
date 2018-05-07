const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../models/User');

// @route   GET http://localhost:7777/api/users/register
// @desc    Register user
// @access  Public`
router.post('/register', (req, res) => {
    // กวดสอบทุกอย่างที่พิมเข้ามาเช่น: name, email, password...
    const {errors, isValid} = validateRegisterInput(req.body);

    // Check Validation
    if(!isValid){
        return res.status(404).json(errors);
    }

    const email = req.body.email;
    User.findOne({email})
        .then(user => {
            if(user){
                return res.status(404).json({ email: 'Email already exists' });
            }else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm' // default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                // generate password ให้มีความปรอดไพ
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
});

// @route   GET http://localhost:7777/api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid){
        return res.status(404).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
        .then(user => {
            // Check user
            if(!user){
                return res.status(404).json({ email: 'User not found' })
            }
            // Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        // Create JWT Payload
                        const payload = { id: user.id, name: user.name, email: user.email, avatar: user.avatar };

                        // Sign Token
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            { expiresIn: 3600 }, 
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            }
                        );
                    } else {
                        return res.json({ password: 'Password incorrect' })
                    }
                })
        });
});

// @route   GET http://localhost:7777/api/users/current
// @desc    Return Current User
// @access  Public
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;