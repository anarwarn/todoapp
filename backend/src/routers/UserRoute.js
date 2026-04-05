const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUser } = require('../controllers/UserController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/status', getUser);

module.exports = router;