const express = require('express');

const router = express.Router();

// @route   GET http://localhost:7777/api/post/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Posts Work'}));

module.exports = router;