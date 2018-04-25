const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Response = require('../../Response');
const { hasRole, authenticate } = require('../../middleware/authentication');

const ClassSchema = require('../../schemas/Classes/ClassSchema');
const ClassGroupSchema = require('../../schemas/Classes/ClassGroupSchema');
const ClassTypeSchema = require('../../schemas/Classes/ClassTypeSchema');
const LocationSchema = require('../../schemas/Locations/LocationSchema');
const TutorSchema = require('../../schemas/Users/TutorSchema');
const SkillSchema = require('../../schemas/Users/SkillSchema');
const UserSchema = require('../../schemas/Users/UserSchema');
const CustomerSchema = require('../../schemas/Users/CustomerSchema');

let Location = mongoose.model('Location', LocationSchema);
let Tutor = mongoose.model('Tutor', TutorSchema);
let Skill = mongoose.model('Skill', SkillSchema);
let User = mongoose.model('User', UserSchema);
let Customer = mongoose.model('Customer', CustomerSchema);
let ClassType = mongoose.model('ClassType', ClassTypeSchema);
let Class = mongoose.model('Class', ClassSchema);
let ClassGroup = mongoose.model('ClassGroup', ClassGroupSchema);

// Get all customers
router.get('/', authenticate, hasRole(['admin', 'tutor']), (req, res) => {
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

router.get('/:id/classes', authenticate, hasRole(['admin']), (req, res) => {
  Class.find({ attendees: req.params.id })
    .populate('location classType classGroup')
    .populate({
      path: 'tutor',
      populate: [
        {
          path: 'user',
          select: 'email'
        },
        {
          path: 'skills',
          model: 'Skill'
        }
      ]
    })
    .populate({
      path: 'attendees',
      populate: {
        path: 'user',
        select: 'email'
      }
    })
    .then(classes => {
      Response.OK(res, classes);
    })
    .catch(err => Response.ERROR(res, err));
});

// Insert customer
router.post('/', (req, res) => {
  let { forename, surname, gender, phone, user } = req.body;
  let { email, password, role } = user;
  const encryptedPassword = bcrypt.hashSync(password, 10);
  User.create({
    email,
    password: encryptedPassword,
    role
  })
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
router.get('/:id', authenticate, hasRole(['admin']), (req, res) => {
  Customer.findById(req.params.id)
    .populate('user')
    .then(user => {
      Response.OK(res, user);
    })
    .catch(err => Response.ERROR(res, err));
});

router.patch(
  '/:id',
  authenticate,
  hasRole(['admin', 'customer']),
  (req, res) => {
    const {
      forename,
      surname,
      phone,
      gender,
      user,
      passwordGuess,
      newPassword
    } = req.body;
    if (!passwordGuess && !newPassword) {
      Response.OK(res, 'Nothing changed with passwords');
      User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            email: user.email,
            password: user.password,
            role: 0
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
    } else {
      console.log(user);
      User.findById(user._id).then(foundUser => {
        if (bcrypt.compareSync(passwordGuess, foundUser.password)) {
          const newHashedPassword = bcrypt.hashSync(newPassword, 10);
          User.findByIdAndUpdate(
            user._id,
            {
              $set: {
                email: user.email,
                password: newHashedPassword,
                role: 0
              }
            },
            { new: true }
          )
            .then(updatedUser => {
              if (!updatedUser) {
                Response.ERROR(
                  res,
                  'An error occurred whilst updating the user'
                );
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
        } else {
          Response.FORBIDDEN(res, 'Existing passwords do not match');
        }
      });
    }
  }
);

// Delete customer
router.delete('/:id', authenticate, hasRole(['admin']), (req, res) => {
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
