const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const locationRoutes = require('./locationRoutes');
const userRoutes = require('./userRoutes');
const classRoutes = require('./classRoutes');

mongoose.connect('mongodb://admin:SurprisedBadger@ds151544.mlab.com:51544/yogabookings', {useMongoClient: true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log("Connected to mongodb via mongoose..."));

router.use('/locations', locationRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);

module.exports = router;
