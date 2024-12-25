const express = require('express');
const { authorize, authenticate } = require('../middleware/authMiddleware');
const { signup, login, logout } = require('../controllers/authController');
const { getUsers, addUser, deleteUser, updatePassword } = require('../controllers/userController');
const { addArtist, getAllArtists, getArtistById, updateArtistById, deleteArtistById } = require('../controllers/artistController');
const { addAlbum, getAlbums, getAlbumById, albumUpdate, deleteAlbumById } = require('../controllers/albumController');
const { createTrack, getAllTracks, getTracks, updateTrack, deleteTrack } = require('../controllers/trackController');
const { createFavorite, getFavorites, deleteFavorite } = require('../controllers/favoriteController');

const router = express.Router();

//Auth Routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', authenticate, logout);

//User Routes
router.get('/users', authenticate, authorize(['Admin']), getUsers);
router.post('/users/add-user', authenticate, authorize(['Admin']), addUser);
router.delete('/users/:user_id', authenticate, authorize(['Admin']), deleteUser);
router.put('/users/update-password', authenticate, authorize(['Admin', 'Editor']), updatePassword);

//Artist Routes
router.post('/artists/add-artist', authenticate, authorize(['Admin', 'Editor', 'Viewer']), addArtist);
router.get('/artists', authenticate, getAllArtists);
router.get('/artists/:artist_id', authenticate, getArtistById);
router.put('/artists/:id', authenticate, authorize(['Admin', 'Editor']), updateArtistById);
router.delete('/artists/:artist_id', authenticate, authorize(['Admin', 'Editor', 'Viewer']), deleteArtistById);

//Album Routes
router.post('/albums/add-album', authenticate, authorize(['Admin', 'Editor', 'Viewer']), addAlbum);
router.get('/albums', authenticate, getAlbums);
router.get('/albums/:id', authenticate, getAlbumById);
router.put('/albums/:id', authenticate, authorize(['Admin', 'Editor']), albumUpdate);
router.delete('/albums/:id', authenticate, authorize(['Admin', 'Editor', 'Viewer']), deleteAlbumById);

//Track Routes
router.post('/tracks/add-track', authenticate, authorize(['Admin', 'Editor', 'Viewer']), createTrack);
router.get('/tracks', authenticate, getAllTracks);
router.get('/tracks/:id', authenticate, getTracks);
router.put('/tracks/:id', authenticate, authorize(['Admin', 'Editor', 'Viewer']), updateTrack);
router.delete('/tracks/:id', authenticate, authorize(['Admin', 'Editor', 'Viewer']), deleteTrack);

//Favorite Routes
router.post('/favorites/add-favorite', authenticate, authorize(['Admin', 'Editor', 'Viewer']), createFavorite);
router.get('/favorites/:category', authenticate, getFavorites);
router.delete('/favorites/remove-favorite/:id', authenticate, authorize(['Admin', 'Editor', 'Viewer']), deleteFavorite);





















module.exports = router;
