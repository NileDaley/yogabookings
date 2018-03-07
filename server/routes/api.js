const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const locationRoutes = require('./locationRoutes');
const userRoutes = require('./userRoutes');
const classRoutes = require('./classes/classRoutes');
const authRoutes = require('./authRoutes');

mongoose.connect(process.env.DB_CONNECTION, { useMongoClient: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log("Connected to mongodb via mongoose..."));

router.use('/locations', locationRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);
router.use('/auth', authRoutes);

router.all('/protected', validate, (req, res, next) => {
  console.log("Got into protected");
  res.status(200).json({'status': 'authorized'});
});

function validate(req, res, next) {
  if (req.headers['authorization']) {
    const token = req.headers['authorization'].split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("403");
        res.send(403, err);
      } else {
        console.log("OK")
        next();
      }
    });
  } else {
    res.send(403, err);
  }
};

module.exports = router;
