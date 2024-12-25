const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const favoriteSchema = new mongoose.Schema(
    {
        favorite_id: {
            type: String,
            required: true,
            default: uuidv4
        },
        category: {
            type: String,
            required: true,
            enum: ['artist', 'album', 'track'],
            trim: true
        },
        item_id: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Favorite', favoriteSchema);
