

const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type: String, default: uuidv4 },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Editor', 'Viewer'],
        required: true,
    },
    adminId: {
        type: String,
        ref: 'User',
        required: false,
    }
}, { timestamps: true });



module.exports = mongoose.model('User', userSchema);
