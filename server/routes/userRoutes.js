const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Response = require('../Response');

const UserSchema = require('../schemas/Users/UserSchema');
const adminRoutes = require('./users/adminRoutes');
const tutorRoutes = require('./users/tutorRoutes');
const customerRoutes = require('./users/customerRoutes');

router.use('/customers', customerRoutes);
router.use('/tutors', tutorRoutes);
router.use('/admins', adminRoutes);

// Get all users
router.get('/', (req, res) => {
  let User = mongoose.model('User', UserSchema);
  User.find()
    .select('email role')
    .then(users => {
      if (!users) {
        Response.NOT_FOUND(res)
      }
      else {
        Response.OK(res, users);
      }
    })
    .catch(err => Response.ERROR(res, err))
});

// Get single user
router.get('/:id', (req, res) => {
  let User = mongoose.model('User', UserSchema);
  User.findById(req.params.id)
    .select('email role')
    .then(user => {
      if (!user) {
        Response.NOT_FOUND(res)
      } else {
        Response.OK(res, user);
      }
    })
    .catch(err => Response.ERROR(res, err))
});

router.delete('/:id', (req, res) => {
  let User = mongoose.model('User', UserSchema);
  User.findByIdAndRemove(req.params.id)
    .then(data => {
      if (!data) {
        Response.ERROR(res);
      } else {
        Response.OK(res, data);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

module.exports = router;
