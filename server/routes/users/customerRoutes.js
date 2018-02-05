const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const CustomerSchema = require('../../schemas/Users/CustomerSchema');
const UserSchema = require('../../schemas/Users/UserSchema');

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

// Get all customers
router.get('/', (req, res) => {
  let Customer = mongoose.model('Customer', CustomerSchema);
  let User = mongoose.model('User', UserSchema);
  Customer.find()
    .populate('user')
    .then(users => {
      response.data = users;
      res.send(response);
    })
    .catch(err => sendError(err, res));
});

// Insert customer
router.post('/', (req, res) => {

  let Customer = mongoose.model('Customer', CustomerSchema);
  let User = mongoose.model('User', UserSchema);

  let {forename, surname, gender, phone} = req.body;
  let userValues = req.body.user;

  let user = new User(userValues);
  user.save()
    .then(newUser => {

      let customer = new Customer({
        forename,
        surname,
        gender,
        phone,
        user: mongoose.Types.ObjectId(newUser._id)
      });

      customer.save()
        .then(newCustomer => {

          response.data = newCustomer;
          response.status = 201;
          res.json(response);

          response.status = 200;
        })
        .catch(err => sendError(err, res));

    })
    .catch(err => sendError(err, res));
});

// Get single customer
router.get('/:id', (req, res) => {
  let Customer = mongoose.model('Customer', CustomerSchema);
  let User = mongoose.model('User', UserSchema);

  Customer.findById(req.params.id)
    .populate('user')
    .then(user => {
      response.data = user;
      res.send(user);
    })
    .catch(err => sendError(err, res));
});

// Update customer
router.patch('/:id', (req, res) => {

  let Customer = mongoose.model('Customer', CustomerSchema);
  let User = mongoose.model('User', UserSchema);

  let {forename, surname, phone, gender, user} = req.body;

  User.update(
    {_id: user._id},
    {
      $set: {
        email: user.email,
        password: user.password
      }
    }
  ).then(updatedUser => {

    Customer.update({_id: req.params.id},
      {
        $set: {
          forename,
          surname,
          phone,
          gender,
          user: mongoose.Types.ObjectId(updatedUser._id)
        }
      })
      .then(updatedCustomer => {
        response.data = updatedCustomer;
        res.json(response);
      })
      .catch(err => sendError(err, res));

  }).catch(err => sendError(err, res));


});

// Delete customer
router.delete('/:id', (req, res) => {

  let Customer = mongoose.model('Customer', CustomerSchema);
  let User = mongoose.model('User', UserSchema);


  Customer.findByIdAndRemove(req.params.id)
    .then(deletedCustomer => {

      let userID = deletedCustomer.user._id;

      User.findByIdAndRemove(userID)
        .then(deletedUser => {

          response.data = [];
          res.json(response);

        })
        .catch(err => sendError(err, res));

    })
    .catch(err => sendError(err, res));

});

module.exports = router;
