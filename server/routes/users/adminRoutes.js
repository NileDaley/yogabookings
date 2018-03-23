const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Response = require('../../Response');
const { hasRole, authenticate } = require('../../middleware/authentication');

const UserSchema = require('../../schemas/Users/UserSchema');
const AdminSchema = require('../../schemas/Users/AdminSchema');

let Admin = mongoose.model('Admin', AdminSchema);
let User = mongoose.model('User', UserSchema);

router.get('/', authenticate, hasRole(['admin']), (req, res) => {
  Admin.find()
    .populate('user')
    .then(data => {
      if (!data) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, data);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

router.post('/', authenticate, hasRole(['admin']), (req, res) => {
  const { forename, surname, isOwner, user } = req.body;
  const { email, password } = user;
  encryptedPassword = bcrypt.hashSync(password, 10);
  User.create({ email, password: encryptedPassword, role: 20 })
    .then(newUser => {
      if (!newUser) {
        Response.ERROR(res, 'An error occurred whilst inserting the new user');
      } else {
        const userID = mongoose.Types.ObjectId(newUser._id);

        Admin.create({ forename, surname, isOwner, user: userID })
          .then(newAdmin => {
            console.log(newAdmin);
            if (!newAdmin) {
              Response.ERROR(
                res,
                'An error occurred whilst inserting the new tutor'
              );
            } else {
              Response.CREATED(res, newAdmin);
            }
          })
          .catch(err => {
            Response.ERROR(res, err);
          });
      }
    })
    .catch(err => Response.ERROR(res, err));
});

module.exports = router;
