
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');


const getUsers = async (req, res) => {
    try {
        if(req.user.role !== 'Admin') {
            return res.status(403).json({
                status: 403,
                data: null,
                message: 'Forbidden Access/Operation not allowed.',
                error: null,
            });
        }

        const users = await User.find({ adminId: req.user.user_id });

        if(users.length === 0) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'No users found for this admin.',
                error: null,
            });
        }

        return res.status(200).json({
            status: 200,
            data: users,
            message: 'Users listed successfully.',
            error: null,
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const addUser = async (req, res) => {

    const { email, password, role } = req.body;

    if(req.user.role !== 'Admin') {
        return res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
    }

    if(!['Editor', 'Viewer'].includes(role)) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request',
            error: 'Invalid role provided. Allowed roles are "Editor" or "Viewer".',
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(409).json({
                status: 409,
                data: null,
                message: 'Email already exists.',
                error: null,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            role,
            adminId: req.user.user_id,

        });

        await newUser.save();

        return res.status(201).json({
            status: 201,
            data: null,
            message: 'User created successfully.',
            error: null,
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    const { user_id } = req.params;

    if(req.user.role !== 'Admin') {
        return res.status(403).json({
            status: 403,
            data: null,
            message: 'Forbidden Access/Operation not allowed.',
            error: null,
        });
    }

    try {
        const user = await User.findById(user_id);

        if(!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null,
            });
        }

        await user.deleteOne()

        return res.status(200).json({
            status: 200,
            data: null,
            message: 'User deleted successfully.',
            error: null,
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const updatePassword = async (req, res) => {
    console.log(req.user)
    const { old_password, new_password } = req.body;
    const userId = req.user.user_id;
    console.log(userId)

    if(!old_password || !new_password) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request',
            error: 'Both old and new passwords are required.',
        });
    }

    try {
        const user = await User.findOne({ user_id: userId });


        if(!user) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'User not found.',
                error: null,
            });
        }

        const isOldPasswordCorrect = await bcrypt.compare(old_password, user.password);

        if(!isOldPasswordCorrect) {
            return res.status(401).json({
                status: 401,
                data: null,
                message: 'Unauthorized Access',
                error: 'Old password is incorrect.',
            });
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 10);

        user.password = hashedNewPassword;
        await user.save();

        return res.status(204).send();

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

module.exports = {
    getUsers, addUser, deleteUser, updatePassword
}