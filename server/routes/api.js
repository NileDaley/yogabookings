const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authentication');
const { authenticate, hasRole } = authMiddleware;

const locationRoutes = require('./locationRoutes');
const userRoutes = require('./userRoutes');
const classRoutes = require('./classes/classRoutes');
const authRoutes = require('./authRoutes');

mongoose.connect(process.env.DB_CONNECTION, { useMongoClient: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to mongodb via mongoose...'));

router.use('/locations', locationRoutes);
router.use('/users', authenticate, userRoutes);
router.use('/classes', classRoutes);
router.use('/auth', authRoutes);

router.get(
  '/protected',
  authenticate,
  hasRole(['customer']),
  (req, res, next) => {
    res.status(200).send('GOT TO PROTECTED');
  }
);

module.exports = router;
