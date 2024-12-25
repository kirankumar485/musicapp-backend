const Artist = require('../models/ArtistSchema');
const AlbumSchema = require('../models/AlbumSchema');
const TrackSchema = require('../models/TrackSchema');


const createTrack = async (req, res) => {
    try {
        const { artist_id, album_id, name, duration, hidden } = req.body;

        if(!artist_id || !album_id || !name || !duration) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request. Please provide artist_id, album_id, name, and duration.",
                error: "Missing required fields"
            });
        }

        const artist = await Artist.findOne({ artist_id });
        if(!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Artist not found.",
                error: "Resource doesn't exist"
            });
        }

        const album = await AlbumSchema.findOne({ album_id });
        if(!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Album not found.",
                error: "Resource doesn't exist"
            });
        }

        const track = new TrackSchema({
            artist_id,
            album_id,
            name,
            duration,
            hidden: hidden || false,
        });

        await track.save();

        res.status(201).json({
            status: 201,
            data: null,
            message: "Track created successfully.",
            error: null
        });

    } catch(error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            data: null,
            message: "An error occurred while creating the track.",
            error: error.message,
        });
    }

}

const getAllTracks = async (req, res) => {
    try {
        const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;

        const parsedLimit = parseInt(limit, 10);
        const parsedOffset = parseInt(offset, 10);

        const filter = {};

        if(artist_id) {
            filter.artist_id = artist_id;
        }

        if(album_id) {
            filter.album_id = album_id;
        }

        if(hidden !== undefined) {
            filter.hidden = hidden === 'true';
        }

        const tracks = await TrackSchema.find(filter)
            .skip(parsedOffset)
            .limit(parsedLimit)
            .populate('artist_id')
            .populate('album_id');

        res.status(200).json({
            status: 200,
            data: tracks,
            message: "Tracks retrieved successfully.",
            error: null,
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            data: null,
            message: "An error occurred while fetching tracks.",
            error: error.message,
        });
    }
}

const getTracks = async (req, res) => {
    try {
        const trackId = req.params.id;
        console.log(trackId)

        const track = await TrackSchema.findOne({ track_id: trackId });

        if(!track) {
            return res.status(404).json({
                status: 404,
                message: 'Track not found',
                error: null
            });
        }

        res.status(200).json({
            status: 200,
            data: {
                track_id: track._id,
                artist_name: track.artist_name,
                album_name: track.album_name,
                name: track.name,
                duration: track.duration,
                hidden: track.hidden
            },
            message: 'Track retrieved successfully.',
            error: null
        });
    } catch(error) {
        console.error('Error retrieving track:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error.',
            error: error.message
        });
    }
}

const updateTrack = async (req, res) => {
    try {
        console.log(req.params)
        const trackId = req.params.id;
        const { name, duration, hidden } = req.body;

        const track = await TrackSchema.findOne({ track_id: trackId });

        if(!track) {
            return res.status(404).json({
                status: 404,
                message: 'Track not found',
                error: null
            });
        }

        if(name !== undefined) track.name = name;
        if(duration !== undefined) track.duration = duration;
        if(hidden !== undefined) track.hidden = hidden;

        await track.save();

        res.status(204).json({
            status: 204,
            message: 'Track updated successfully',
            error: null
        });
    } catch(error) {
        console.error('Error updating track:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error.',
            error: error.message
        });
    }
}

const deleteTrack = async (req, res) => {
    try {
        const trackId = req.params.id;

        const track = await TrackSchema.findOne({ track_id: trackId });

        if(!track) {
            return res.status(404).json({
                status: 404,
                message: 'Track not found',
                error: null
            });
        }
        res.status(200).json({
            status: 200,
            data: null,
            message: `Track:${track.name} deleted successfully.`,
            error: null
        });
        await track.deleteOne()

    } catch(error) {
        console.error('Error deleting track:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error.',
            error: error.message
        });
    }
}

module.exports = {
    createTrack, getAllTracks, getTracks, updateTrack, deleteTrack
}