
const Artist = require('../models/ArtistSchema');
const AlbumSchema = require('../models/AlbumSchema');

const addAlbum = async (req, res) => {
    console.log(req.body)
    const { artist_id, name, year, hidden } = req.body;

    try {

        if(!artist_id || !name || !year || hidden === undefined) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: 'Bad Request',
                error: 'Missing required fields',
            });
        }

        const artistExists = await Artist.findOne({ artist_id });
        if(!artistExists) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: 'Resource Doesn\'t Exist',
                error: 'Artist not found',
            });
        }

        const newAlbum = new AlbumSchema({
            artist_id,
            name,
            year,
            hidden,
        });

        await newAlbum.save();

        return res.status(201).json({
            status: 201,
            data: null,
            message: 'Album created successfully.',
            error: null,
        });
    } catch(error) {
        console.error(error);
        if(error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 401,
                data: null,
                message: 'Unauthorized Access',
                error: 'Invalid token',
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

const getAlbums = async (req, res) => {
    const { limit = 5, offset = 0, artist_id, hidden } = req.query;

    try {

        const conditions = {};
        if(artist_id) {
            const artistExists = await Artist.findOne({ artist_id });
            if(!artistExists) {
                return res.status(404).json({
                    status: 404,
                    data: null,
                    message: 'Artist not found, not valid artist ID',
                    error: 'Artist not found',
                });
            }
            conditions.artist_id = artist_id;
        }
        if(hidden !== undefined) {
            conditions.hidden = hidden === 'true';
        }

        const albums = await AlbumSchema.find(conditions)
            .skip(parseInt(offset))
            .limit(parseInt(limit));

        return res.status(200).json({
            status: 200,
            data: albums,
            message: 'Albums retrieved successfully.',
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

const getAlbumById = async (req, res) => {
    try {
        const { id } = req.params;

        const album = await AlbumSchema.findOne({ album_id: id });
        if(!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Album not found.",
                error: "Resource doesn't exist",
            });
        }

        const artist = await Artist.findOne({ artist_id: album.artist_id });
        const artist_name = artist ? artist.name : "Unknown Artist";

        res.status(200).json({
            status: 200,
            data: {
                album_id: album.album_id,
                artist_name: artist_name,
                name: album.name,
                year: album.year,
                hidden: album.hidden,
            },
            message: "Album retrieved successfully.",
            error: null,
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            data: null,
            message: "An error occurred while fetching the album.",
            error: error.message,
        });
    }

}

const albumUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, year, hidden } = req.body;

        if(!name && !year && hidden === undefined) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request. Please provide at least one field to update.",
                error: "Invalid input data"
            });
        }

        const album = await AlbumSchema.findOne({ album_id: id });
        if(!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Album not found.",
                error: "Resource doesn't exist"
            });
        }

        if(name) album.name = name;
        if(year) album.year = year;
        if(hidden !== undefined) album.hidden = hidden;

        await album.save();

        res.status(204).json({
            status: 204,
            data: null,
            message: "Album updated successfully.",
            error: null
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            data: null,
            message: "An error occurred while updating the album.",
            error: error.message,
        });
    }

}

const deleteAlbumById = async (req, res) => {
    try {
        const { id } = req.params;

        const album = await AlbumSchema.findOne({ album_id: id });
        if(!album) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Album not found.",
                error: "Resource doesn't exist"
            });
        }

        await album.deleteOne();

        res.status(200).json({
            status: 200,
            data: null,
            message: `Album: ${album.name} deleted successfully.`,
            error: null
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            data: null,
            message: "An error occurred while deleting the album.",
            error: error.message,
        });
    }

}

module.exports = {
    addAlbum, getAlbums, getAlbumById, albumUpdate, deleteAlbumById
}