const FavoriteSchema = require('../models/FavoriteSchema');

const createFavorite = async (req, res) => {
    try {
        const { category, item_id } = req.body;

        if(!category || !item_id) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Category and item_id are required.",
                error: null
            });
        }

        const validCategories = ["artist", "album", "track"];
        if(!validCategories.includes(category)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Invalid category. Must be one of 'artist', 'album', or 'track'.",
                error: null
            });
        }

        const existingFavorite = await FavoriteSchema.findOne({ category, item_id });
        if(existingFavorite) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Item is already in favorites.",
                error: null
            });
        }

        const newFavorite = new FavoriteSchema({ category, item_id });
        await newFavorite.save();

        res.status(201).json({
            status: 201,
            data: null,
            message: "Favorite added successfully.",
            error: null
        });
    } catch(error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({
            status: 500,
            data: null,
            message: "Internal server error.",
            error: error.message
        });
    }

}

const getFavorites = async (req, res) => {
    try {
        const { category } = req.params;
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;

        const validCategories = ["artist", "album", "track"];
        if(!validCategories.includes(category)) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Invalid category. Must be one of 'artist', 'album', or 'track'.",
                error: null
            });
        }

        const favorites = await FavoriteSchema.find({ category })
            .skip(offset)
            .limit(limit)
            .select('_id category item_id createdAt favorite_id')
            .lean();

        if(favorites.length === 0) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: `No favorites found for category: ${category}`,
                error: null
            });
        }
        console.log(favorites)
        const responseData = favorites.map((fav) => ({

            favorite_id: fav.favorite_id,
            category: fav.category,
            item_id: fav.item_id,
            created_at: fav.createdAt
        }));

        res.status(200).json({
            status: 200,
            data: responseData,
            message: "Favorites retrieved successfully.",
            error: null
        });
    } catch(error) {
        console.error('Error retrieving favorites:', error);
        res.status(500).json({
            status: 500,
            data: null,
            message: "Internal server error.",
            error: error.message
        });
    }
}

const deleteFavorite = async (req, res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status: 400,
                data: null,
                message: "Bad Request: favorite_id is required.",
                error: "Invalid favorite_id."
            });
        }

        const favorite = await FavoriteSchema.findOne({ favorite_id: id });
        console.log(favorite)
        if(!favorite) {
            return res.status(404).json({
                status: 404,
                data: null,
                message: "Resource Doesn't Exist: Favorite not found.",
                error: "Favorite not found."
            });
        }

        res.status(200).json({
            status: 200,
            data: null,
            message: "Favorite removed successfully.",
            error: null
        });
        await favorite.deleteOne()
    } catch(error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({
            status: 500,
            data: null,
            message: "Internal Server Error.",
            error: error.message
        });
    }
}

module.exports = {
    createFavorite, getFavorites, deleteFavorite
}