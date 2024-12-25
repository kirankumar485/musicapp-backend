const Artist = require('../models/ArtistSchema');

const addArtist = async (req, res) => {
    const { name, grammy, hidden } = req.body;

    try {
        const newArtist = new Artist({
            name,
            grammy,
            hidden,
        });

        await newArtist.save();

        return res.status(201).json({
            status: 201,
            data: null,
            message: 'Artist created successfully.',
            error: null,
        });
    } catch(error) {
        console.error(error);
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request',
            error: error.message,
        });
    }
};

const getAllArtists = async (req, res) => {
    const { limit = 5, offset = 0, grammy, hidden } = req.query;

    const limitValue = parseInt(limit) || 5;
    const offsetValue = parseInt(offset) || 0;

    let filter = {};

    if(grammy) {
        filter.grammy = grammy;
    }

    if(hidden !== undefined) {
        filter.hidden = hidden === 'true';
    }

    try {
        const artists = await Artist.find(filter)
            .skip(offsetValue)
            .limit(limitValue);

        return res.status(200).json({
            status: 200,
            data: artists,
            message: 'Artists retrieved successfully.',
            error: null,
        });
    } catch(error) {
        console.error(error);
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request',
            error: error.message,
        });
    }
};

const getArtistById = async (req, res) => {
    console.log(req.params)
    const { artist_id } = req.params;

    try {
        const artist = await Artist.findById(artist_id);

        if(!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: 'Artist with the provided ID does not exist.',
            });
        }

        return res.status(200).json({
            status: 200,
            data: artist,
            message: 'Artist retrieved successfully.',
            error: null,
        });
    } catch(error) {
        console.error(error);

        if(error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 401,
                data: null,
                message: 'Unauthorized Access.',
                error: 'Invalid or expired token.',
            });
        }

        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const updateArtistById = async (req, res) => {
    console.log(req.params)
    const { id } = req.params;
    const { name, grammy, hidden } = req.body;

    if(!name && grammy === undefined && hidden === undefined) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: 'Bad Request',
            error: 'No fields provided to update.',
        });
    }

    try {
        console.log(id)
        const artist = await Artist.findById(id);

        if(!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found.',
                error: 'Artist with the provided ID does not exist.',
            });
        }

        if(name) artist.name = name;
        if(grammy !== undefined) artist.grammy = grammy;
        if(hidden !== undefined) artist.hidden = hidden;

        await artist.save();

        return res.status(204).json({
            status: 204,
            data: null,
            message: 'Artist updated successfully.',
            error: null,
        });
    } catch(error) {
        console.error(error);

        if(error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 401,
                data: null,
                message: 'Unauthorized Access.',
                error: 'Invalid or expired token.',
            });
        }

        return res.status(500).json({
            status: 500,
            data: null,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const deleteArtistById = async (req, res) => {
    console.log(req.params)
    const { artist_id } = req.params;


    try {

        const artist = await Artist.findById(artist_id);

        if(!artist) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Artist not found',
                error: 'Artist with the provided ID does not exist.',
            });
        }

        // Delete the artist
        await artist.deleteOne();

        return res.status(200).json({
            status: 200,
            data: {
                artist_id: artist_id,
            },
            message: `Artist: ${artist.name} deleted successfully.`,
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


module.exports = {
    addArtist, getAllArtists, getArtistById, updateArtistById, deleteArtistById
}