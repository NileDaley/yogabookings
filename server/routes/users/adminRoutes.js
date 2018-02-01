const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const UserSchema = require('../../schemas/Users/UserSchema');
const AdminSchema = require('../../schemas/Users/AdminSchema');

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
  let Admin = mongoose.model('Admin', AdminSchema);
  let User = mongoose.model('User', UserSchema);
  Admin.find()
    .populate('user')
    .then(data => {
      response.data = data;
      res.send(response);
    })
    .catch(err => sendError(err, res));
});

module.exports = router;
