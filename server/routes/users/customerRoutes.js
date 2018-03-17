const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Response = require('../../Response');
const { hasRole } = require('../../middleware/authentication');

const CustomerSchema = require('../../schemas/Users/CustomerSchema');
const UserSchema = require('../../schemas/Users/UserSchema');

let Customer = mongoose.model('Customer', CustomerSchema);
let User = mongoose.model('User', UserSchema);

// Get all customers
router.get('/', hasRole(['admin', 'tutor']), (req, res) => {
  Customer.find()
    .populate('user')
    .then(customers => {
      if (!customers) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, customers);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

// Insert customer
router.post('/', hasRole(['admin']), (req, res) => {
  let { forename, surname, gender, phone } = req.body;
  let userValues = req.body.user;

  let user = new User(userValues);
  user
    .save()
    .then(newUser => {
      if (!newUser) {
        Response.ERROR(
          res,
          'An error occurred whilst inserting the user record'
        );
      } else {
        let customer = new Customer({
          forename,
          surname,
          gender,
          phone,
          user: mongoose.Types.ObjectId(newUser._id)
        });

        customer
          .save()
          .then(newCustomer => {
            if (!newCustomer) {
              Response.ERROR(
                res,
                'An error occurred whilst inserting the customer record'
              );
            } else {
              Response.CREATED(res, newCustomer);
            }
          })
          .catch(err => Response.ERROR(res, err));
      }
    })
    .catch(err => Response.ERROR(res, err));
});

// Get single customer
// TODO: isSelf
router.get('/:id', hasRole(['admin']), (req, res) => {
  Customer.findById(req.params.id)
    .populate('user')
    .then(user => {
      Response.OK(res, user);
    })
    .catch(err => Response.ERROR(res, err));
});

router.patch('/:id', hasRole(['admin'], true), (req, res) => {
  let { forename, surname, phone, gender, user } = req.body;
  User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        email: user.email,
        password: user.password,
        role: user.role
      }
    },
    { new: true }
  )
    .then(updatedUser => {
      if (!updatedUser) {
        Response.ERROR(res, 'An error occurred whilst updating the user');
      } else {
        Customer.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              forename,
              surname,
              phone,
              gender,
              user: mongoose.Types.ObjectId(updatedUser._id)
            }
          },
          { new: true }
        )
          .then(updatedCustomer => {
            Response.OK(res, updatedCustomer);
          })
          .catch(err => Response.ERROR(res, err));
      }
    })
    .catch(err => Response.ERROR(res, err));
});

// Delete customer
router.delete('/:id', hasRole(['admin']), (req, res) => {
  Customer.findById(req.params.id).then(cust => {
    if (!cust) {
      Response.ERROR(res, 'Could not retrieve the customer to be deleted');
    } else {
      let userID = cust.user;

      User.remove({ _id: userID })
        .then(() => {
          Customer.remove({ _id: req.params.id })
            .then(() => {
              Response.OK(res);
            })
            .catch(err => Response.ERROR(res, err));
        })
        .catch(err => Response.ERROR(res, err));
    }
  });
});

module.exports = router;
