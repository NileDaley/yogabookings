const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const Response = require('../Response');
const UserSchema = require('../schemas/Users/UserSchema');
const User = mongoose.model('User', UserSchema);

router.post('/login', (req, res) => {
  let { email, password } = req.body;

  User.find({ "email": email })
    .then(data => {
      data = data[0];
      if (!data || data.length === 0) {
        Response.NOT_FOUND(res, 'No user was found with the provided email address');
      } else {
        if (password === data.password) {

          let expiresIn = 60 * 60;
          let tokenData = JSON.stringify({
            _id: data._id,
            role: data.role
          });
          let token = jwt.sign({
            data: tokenData
          }, process.env.JWT_SECRET, { expiresIn });

          Response.OK(res, { token, expiresIn }, `Login matched`);
        } else {
          Response.FORBIDDEN(res, 'Passwords do not match');
        }
      }
    });
});

module.exports = router;
