const express = require('express');

const router = express.Router();

// @route   GET http://localhost:7777/api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Profile Work'}));

module.exports = router;