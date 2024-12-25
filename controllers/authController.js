const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/Users');


const signup = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        let countDocs = await User.countDocuments();
        if(!countDocs == 0) {
            if(role !== 'Admin') {
                return res.status(403).json({
                    status: 403,
                    data: null,
                    message: 'Forbidden: Only admins can register.',
                    error: 'Forbidden: Only admins can register.',
                });
            }
        }

        if(!email || !password) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Email and password are required.',
                error: 'Email and password are required.',
            });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: 'User already exists.',
                error: 'User already exists.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRole = (countDocs) === 0 ? 'Admin' : role;

        const newUser = new User({ email, password: hashedPassword, role: userRole });

        await newUser.save();

        res.status(201).json({
            status: 201,
            data: null,
            message: 'User created successfully.',
            error: null,
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal server error',
            error: err.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '5h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');

    return res.status(200).json({
        status: 200,
        data: null,
        message: "User logged out successfully.",
        error: null,
    });
};


module.exports = {
    signup, login, logout
}