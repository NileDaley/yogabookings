const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const UserSchema = require('../schemas/UserSchema');
const adminRoutes = require('./users/adminRoutes');
const tutorRoutes = require('./users/tutorRoutes');
const customerRoutes = require('./users/customerRoutes');

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.data = [];
  response.message = typeof err === 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

router.use('/customers', customerRoutes);
router.use('/tutors', tutorRoutes);
router.use('/admins', adminRoutes);

// Get all users
router.get('/', (req, res) => {
  let User = mongoose.model('User', UserSchema);
  User.find()
    .select('email role')
    .then(data => {
      response.data = data;
      res.json(response);
    })
    .catch(err => sendError(err, res))
});

// Get single user
router.get('/:id', (req, res) => {
  let User = mongoose.model('User', UserSchema);
  User.findById(req.params.id)
    .select('email role')
    .then(data => {
      response.data = data;
      res.json(response);
    })
    .catch(err => sendError(err, res))
});

router.delete('/:id', (req,res) => {
  let User = mongoose.model('User', UserSchema);
  User.findByIdAndRemove(req.params.id)
    .then((data, err) => {
      if (err) sendError(err,res);
      response.data = data;
      res.json(response);
    })
    .catch(err => sendError(err,res));
});
module.exports = router;
