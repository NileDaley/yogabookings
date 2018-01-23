const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const LocationSchema = require('../schemas/LocationSchema');
const UserSchema = require('../schemas/UserSchema');

mongoose.connect('mongodb://admin:SurprisedBadger@ds151544.mlab.com:51544/yogabookings', {useMongoClient: true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log("Connected to mongodb via mongoose..."));

// Error handling
const sendError = (err, res) => {
  response.status = 501
  response.message = typeof err == 'object' ? err.message : err
  res.status(501).json(response)
}

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
}

// Get all users
router.get('/users', (req, res) => {
  let User = mongoose.model('User', UserSchema);
  User.find({role: 0})
          .then((data,err) => {
            response.data = data;
            res.json(response);
          })
          .catch(err => sendError(err,res))
})

// Get single user
router.get('/users/:id', (req, res) => {
  let User = mongoose.model('User', UserSchema)
  User.findById(req.params.id)
          .then((data,err) => {
            response.data = data;
            res.json(response);
          })
          .catch(err => sendError(err,res))
})

// Get all locations
router.get('/locations', (req,res) => {

  let Location = mongoose.model('Location', LocationSchema);
  Location.find()
          .then((data,err) => {
            response.data = data;
            res.json(response);
          })
          .catch(err => sendError(err,res))
})

// Get single location
router.get('/locations/:id', (req, res) => {
  let Location = mongoose.model('Location', LocationSchema)
  Location.findById(req.params.id)
          .then((data,err) => {
            response.data = data;
            res.json(response);
          })
          .catch(err => sendError(err,res))
})

// Update single location
router.patch('/locations/update/:id', (req,res) => {

  let location = mongoose.model('Location', LocationSchema);
  let updateValues = req.body;

  location.update({_id: req.params.id}, {$set: updateValues})
          .then((data,err) => {
            if(err) sendError(err,res)
            response.data = {
              status: data['n'] > 0  && data['nModified'] > 0,
              matched: data['n'],
              modified: data['nModified']
            }
            res.json(response)
          })
          .catch(err => { console.log("sending error... "); sendError(err,res )})
})

module.exports = router
