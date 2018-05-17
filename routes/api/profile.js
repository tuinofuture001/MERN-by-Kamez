const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route   GET http://localhost:7777/api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Profile Work'}));

// @route   GET http://localhost:7777/api/profile
// @desc    Get current User
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
        // populate อ้างอีงเถิง user ใน model Profile เพื่อดิงเอาค่า name, avatar จาก collection(table) Users
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err))
});

// @route   GET http://localhost:7777/api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
    const errors = {};

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noprofile = 'There are no profiles';
                return res.status(404).json(errors);
            }
            return res.json(profiles);
        })
        .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});

// @route   GET http://localhost:7777/api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({ handle: req.params.handle })
        // populate อ้างอีงเถิง user ใน model Profile เพื่อดิงเอาค่า name, avatar จาก collection(table) Users
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }

            return res.json(profile);
        })
        .catch(err => res.status(404).json(err))
});

// @route   GET http://localhost:7777/api/profile/user/:user_id
// @desc    Get profile by user_id
// @access  Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.params.user_id })
        // populate อ้างอีงเถิง user ใน model Profile เพื่อดิงเอาค่า name, avatar จาก collection(table) Users
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }

            return res.json(profile);
        })
        .catch(err => res.status(404).json({profile: 'There is no profile for this user'}))
});

// @route   POST http://localhost:7777/api/profile
// @desc    Create and Update User Profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if(!isValid) {
        // Return any error with 400 status
        return res.status(400).json(errors);
    }
    
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.contact) profileFields.contact = req.body.contact;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // Skills - Split into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(profile) {
                // Update
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                    .then(profile => res.json(profile));
            }else {
                // Create
                // Check if handle exists
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if(profile) {
                            errors.handle = 'That handle already exists';
                            return res.status(400).json(errors);
                        }
                        // Save Profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    })
            }
        });
});

// @route   POST http://localhost:7777/api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
  
    // Check Validation
    if(!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }
  
    Profile.findOne({ user: req.user.id }).then(profile => {
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        };

        // Add newExp to the beginning of an array
        // เพี่ม nexExp เข้าใน Profile (เข้าในจุดเลี่มต้นของ array Experience)
        profile.experience.unshift(newExp);
        profile.save().then(profile => res.json(profile));
    });
});

// @route   POST http://localhost:7777/api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
      const { errors, isValid } = validateEducationInput(req.body);
  
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }
  
      Profile.findOne({ user: req.user.id }).then(profile => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
  
        // Add newEdu to the beginning of an array
        // เพี่ม newEdu เข้าใน Profile (เข้าในจุดเลี่มต้นของ array Education)
        profile.education.unshift(newEdu);
        profile.save().then(profile => res.json(profile));
      });
    }
);

// @route   DELETE http://localhost:7777/api/profile/experience/:exp_id
// @desc    Delete experience to profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
        // Get remove index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

        if (removeIndex < 0) {
            return res.status(404).json({
                error: 'There is no education with this User',
            });
        }
        // Split out of array
        profile.experience.splice(removeIndex, 1);
        // Save
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE http://localhost:7777/api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            // Get remove index
            const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);

            if (removeIndex < 0) {
                return res.status(404).json({
                    error: 'There is no education with this User',
                });
            }
            // Splice out of array
            profile.education.splice(removeIndex, 1);
            // Save
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
            res.json({ success: true })
        );
    });
});

module.exports = router;