const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const TutorSchema = require('../../schemas/TutorSchema');
const UserSchema = require('../../schemas/UserSchema');

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

router.get('/', (req, res) => {
  let Tutor = mongoose.model('Tutor', TutorSchema);
  let User = mongoose.model('User', UserSchema);
  Tutor.find()
    .populate('user')
    .then(data => {
      response.data = data;
      res.send(response);
    })
    .catch(err => sendError(err, res));
});

module.exports = router;
