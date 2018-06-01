const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
// Profile model
const Profile = require('../../models/Profile');
// Validation
const validatePostInput = require('../../validation/post');

// @route   GET http://localhost:7777/api/post/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Posts Work'}));

// @route   Post http://localhost:7777/api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);
        // Check Validation
        if (!isValid) {
            // If any errors, send 400 with errors object
            return res.status(400).json(errors);
        }
    
        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        });
    
        newPost.save().then(post => res.json(post));
    }
);

// @route   DELETE http://localhost:7777/api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Post.findById(req.params.post_id)
            .then(post => {
                // Check for post owner
                if (post.user.toString() !== req.user.id) {
                return res
                    .status(401)
                    .json({ notauthorized: 'User not authorized' });
                }
    
                // Delete
                post.remove().then(() => res.json({ success: true }));
            })
            .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
      });
  }
);

module.exports = router;