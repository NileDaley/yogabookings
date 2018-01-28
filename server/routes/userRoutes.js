const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const UserSchema = require('../schemas/UserSchema');

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err === 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

// Get all users
router.get('/', (req, res) => {
  let User = mongoose.model('User', UserSchema);
  User.find({role: 0})
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
    .then(data => {
      response.data = data;
      res.json(response);
    })
    .catch(err => sendError(err, res))
});

router.delete('/:id', (req,res) => {
  let Location = mongoose.model('User', UserSchema);
  Location.findByIdAndRemove(req.params.id)
    .then((data, err) => {
      if (err) sendError(err,res);
      response.data = data;
      res.json(response);
    })
    .catch(err => sendError(err,res));
});

module.exports = router;
