const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const albumSchema = new mongoose.Schema({
    album_id: { type: String, default: uuidv4 },
    artist_id: { type: String, required: true },
    name: { type: String, required: true },
    year: { type: Number, required: true },
    hidden: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Album', albumSchema);
