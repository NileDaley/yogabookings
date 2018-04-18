const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { hasRole } = require('../middleware/authentication');
const Response = require('../Response');

const CustomerSchema = require('../schemas/Users/CustomerSchema');
const Customer = mongoose.model('Customer', CustomerSchema);

const ClassSchema = require('../schemas/Classes/ClassSchema');
const Class = mongoose.model('Class', ClassSchema);

router.post('/', hasRole(['admin', 'customer']), (req, res) => {
  const { classes, customer } = req.body;
  Customer.findById(customer._id)
    .then(foundCustomer => {
      if (!foundCustomer) {
        Response.NOT_FOUND(res);
      } else {
        let promises = [];
        for (let index = 0; index < classes.length; index++) {
          promises.push(
            new Promise((resolve, reject) => {
              Class.findByIdAndUpdate(
                classes[index]._id,
                { $push: { attendees: mongoose.Types.ObjectId(customer._id) } },
                { new: true }
              )
                .then(result => resolve(result))
                .catch(error => reject(error));
            })
          );
        }
        Promise.all(promises)
          .then(data => {
            Response.OK(res, data);
          })
          .catch(err => {
            Response.ERROR(res, err);
          });
      }
    })
    .catch(err => {
      Response.ERROR(res, err);
    });
});

router.post('/cancel', hasRole(['admin', 'customer']), (req, res) => {
  const { classes, customer } = req.body;
  const promises = classes.map(c => {
    return Class.findByIdAndUpdate(
      c._id,
      { $pull: { attendees: mongoose.Types.ObjectId(customer._id) } },
      { new: true }
    );
  });
  Promise.all(promises)
    .then(data => {
      Response.OK(res, data);
    })
    .catch(err => {
      Response.ERROR(res, err);
    });
});

module.exports = router;
