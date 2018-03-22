const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Response = require('../Response');
const authMiddleware = require('../middleware/authentication');
const { authenticate, hasRole } = authMiddleware;

const UserSchema = require('../schemas/Users/UserSchema');
const adminRoutes = require('./users/adminRoutes');
const tutorRoutes = require('./users/tutorRoutes');
const customerRoutes = require('./users/customerRoutes');

const CustomerSchema = require('../schemas/Users/CustomerSchema');
const Customer = mongoose.model('Customer', CustomerSchema);

const AdminSchema = require('../schemas/Users/AdminSchema');
const Admin = mongoose.model('Admin', AdminSchema);

const TutorSchema = require('../schemas/Users/TutorSchema');
const Tutor = mongoose.model('Tutor', TutorSchema);

let User = mongoose.model('User', UserSchema);

router.use('/customers', customerRoutes);
router.use('/tutors', tutorRoutes);
router.use('/admins', adminRoutes);

// Get all users
router.get('/', authenticate, hasRole(['admin']), (req, res) => {
  User.find()
    .select('email role')
    .then(users => {
      if (!users) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, users);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

// Get single user
// TODO: isSelf ( :id matches res.locals.user._id )
router.get('/:id', authenticate, hasRole(['admin']), (req, res) => {
  User.findById(req.params.id)
    .select('email role')
    .then(user => {
      if (!user) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, user);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

router.delete('/:id', authenticate, hasRole(['admin']), (req, res) => {
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

router.post('/identity', (req, res) => {
  const { role, _id } = req.body;
  let identity = null;
  switch (role) {
    case 0:
      Customer.find({ user: _id })
        .populate('user')
        .then(customer => {
          if (!customer) {
            Response.NOT_FOUND(res);
          } else {
            identity = customer;
            Response.OK(res, ...identity);
          }
        })
        .catch(err => Response.ERROR(res, err));
      break;
    case 10:
      Tutor.find({ user: _id })
        .populate('user')
        .then(tutor => {
          if (!tutor) {
            Response.NOT_FOUND(res);
          } else {
            identity = tutor;
            Response.OK(res, ...identity);
          }
        })
        .catch(err => {
          console.log(err);
          Response.ERROR(res, err);
        });
      break;
    case 20:
      Admin.find({ user: _id })
        .populate('user')
        .then(admin => {
          if (!admin) {
            Response.NOT_FOUND(res);
          } else {
            identity = admin;
            Response.OK(res, ...identity);
          }
        })
        .catch(err => Response.ERROR(res, err));
      break;
  }
});

module.exports = router;
