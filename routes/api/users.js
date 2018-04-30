const express = require('express');

const router = express.Router();

// @route   GET http://localhost:7777/api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({msg: 'Users Work'}));

module.exports = router;