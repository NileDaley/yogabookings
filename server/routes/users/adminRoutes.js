const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Response = require('../../Response');

const UserSchema = require('../../schemas/Users/UserSchema');
const AdminSchema = require('../../schemas/Users/AdminSchema');

router.get('/', (req, res) => {
  let Admin = mongoose.model('Admin', AdminSchema);
  let User = mongoose.model('User', UserSchema);
  Admin.find()
    .populate('user')
    .then(data => {
      if (!data) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res,data);
      }
    })
    .catch(err => Response.ERROR(res,err));
});

module.exports = router;
