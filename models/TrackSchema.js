// MongoDB Schema for Albums (using Mongoose)
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const trackSchema = new mongoose.Schema({
    track_id: { type: String, default: uuidv4 },
    album_id: { type: String, required: true },
    artist_id: { type: String, required: true },
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    hidden: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Track', trackSchema);
