const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const artistSchema = new mongoose.Schema({
    artist_id: {
        type: String,
        required: true,
        default: uuidv4
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    grammy: {
        type: Number,
        required: true,
    },
    hidden: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);
