const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Response = require('../Response');
const authMiddleware = require('../middleware/authentication')
const { authenticate, hasRole } = authMiddleware;;

const UserSchema = require('../schemas/Users/UserSchema');
const adminRoutes = require('./users/adminRoutes');
const tutorRoutes = require('./users/tutorRoutes');
const customerRoutes = require('./users/customerRoutes');

let User = mongoose.model('User', UserSchema);

router.use('/customers', customerRoutes);
router.use('/tutors', tutorRoutes);
router.use('/admins', adminRoutes);

// Get all users
router.get('/', hasRole(['admin']), (req, res) => {

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
// TODO: isSelf ( :id matches res.locals.user._id )
router.get('/:id', hasRole(['admin']), (req, res) => {
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

router.delete('/:id', hasRole(['admin']), (req, res) => {
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
