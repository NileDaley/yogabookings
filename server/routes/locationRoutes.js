const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const LocationSchema = require('../schemas/Locations/LocationSchema');
const VenueSchema = require('../schemas/Locations/VenueSchema');
const OpenHoursSchema = require('../schemas/Locations/OpenHoursSchema');

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err === 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

// Get all locations
router.get('/', (req, res) => {

  let Location = mongoose.model('Location', LocationSchema);
  Location.find()
    .then(data => {
      response.data = data;
      res.json(response);
    })
    .catch(err => sendError(err, res))
});

// Insert Location
router.post('/', (req, res) => {

  let Venue = mongoose.model('Venue', VenueSchema);
  let OpenHours = mongoose.model('OpenHours', OpenHoursSchema);
  let Location = mongoose.model('Location', LocationSchema);

  // Extract location fields from request
  let {name, email, phone, address, venues, openHours} = req.body;

  venues = req.body.venues.map(v => new Venue(v));
  openHours = req.body.openHours.map(day => new OpenHours(day));

  location = new Location({
    name,
    email,
    phone,
    address,
    venues,
    openHours
  });

  location
    .save()
    .then((results, err) => {
      if (err) sendError(err, res);
      response.data = results;
      res.json(response);
    })
    .catch(err => sendError(err, res));

});

// Get single location
router.get('/:id', (req, res) => {
  let Location = mongoose.model('Location', LocationSchema);
  Location.findById(req.params.id)
    .then(data => {
      response.data = data;
      res.json(response);
    })
    .catch(err => sendError(err, res))
});

// Update single location
router.patch('/:id', (req, res) => {

  let location = mongoose.model('Location', LocationSchema);
  let updateValues = req.body;

  location.update({_id: req.params.id}, {$set: updateValues})
    .then((data, err) => {
      if (err) sendError(err, res);
      response.data = {
        status: data['n'] > 0 && data['nModified'] > 0,
        matched: data['n'],
        modified: data['nModified']
      };
      res.json(response)
    })
    .catch(err => {
      console.log("sending error... ");
      sendError(err, res)
    })
});

// Delete a location
router.delete('/:id', (req, res) => {
  Location = mongoose.model('Location', LocationSchema);
  Location
    .findByIdAndRemove(req.params.id)
    .then((data, err) => {
      if (err) sendError(err, res);
      response.data = data;
      res.send(response);
    })
    .catch(err => sendError(err, res));
});

module.exports = router;
