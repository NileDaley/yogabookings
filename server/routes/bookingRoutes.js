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
  console.log('Got into booking post');
  Customer.findById(customer._id)
    .then(foundCustomer => {
      if (!foundCustomer) {
        Response.NOT_FOUND(res);
      } else {
        Class.where('_id')
          .in([...classes.map(c => c._id)])
          .update({
            $push: {
              attendees: mongoose.Types.ObjectId(customer._id)
            }
          })
          .then(data => {
            Response.OK(res, data);
          })
          .catch(err => Response.ERROR(res, err));
        /*
          For each class
            Find the class
            Add it to the array
        */
      }
    })
    .catch(err => Response.ERROR(res, err));
});

module.exports = router;
