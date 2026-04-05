const User = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({ username, password });
        await user.save();

        // Set session
        req.session.userId = user._id;
        req.session.username = user.username;

        res.status(201).json({ message: 'User registered successfully', username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Set session
        req.session.userId = user._id;
        req.session.username = user.username;

        res.json({ message: 'Login successful', username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
};

const getUser = (req, res) => {
    if (req.session.userId) {
        return res.json({ isAuthenticated: true, username: req.session.username });
    }
    res.json({ isAuthenticated: false });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser
}