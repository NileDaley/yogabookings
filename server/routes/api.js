const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authentication');
const { authenticate } = authMiddleware;

const locationRoutes = require('./locationRoutes');
const userRoutes = require('./userRoutes');
const classRoutes = require('./classes/classRoutes');
const authRoutes = require('./authRoutes');
const bookingRoutes = require('./bookingRoutes');

mongoose.connect(process.env.DB_CONNECTION, { useMongoClient: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to mongodb via mongoose...'));

router.use('/locations', locationRoutes);
router.use('/users', authenticate, userRoutes);
router.use('/classes', classRoutes);
router.use('/auth', authRoutes);
router.use('/bookings', authenticate, bookingRoutes);

router.get('/clear', (req, res) => {
  const Class = mongoose.model(
    'Class',
    require('../schemas/Classes/ClassSchema')
  );
  Class.update({}, { $set: { attendees: [] } }, { multi: true })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => res.status(500).send(err));
});

module.exports = router;
