const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Response = require('../Response');

const LocationSchema = require('../schemas/Locations/LocationSchema');
const VenueSchema = require('../schemas/Locations/VenueSchema');
const OpenHoursSchema = require('../schemas/Locations/OpenHoursSchema');

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err === 'object' ? err.message : err;
  response.data = [];
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
    .then(locations => {
      if (!locations) Response.NOT_FOUND(res);
      Response.OK(res, locations);
    })
    .catch(err => Response.ERROR(res, err));

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
    .then(savedLocation => {
      if (!savedLocation) {
        Response.ERROR(res)
      } else {
        Response.OK(res, savedLocation);
      }
    })
    .catch(err => Response.ERROR(res, err));

});

// Get single location
router.get('/:id', (req, res) => {
  let Location = mongoose.model('Location', LocationSchema);
  Location.findById(req.params.id)
    .then(location => {
      if (!location) {
        Response.NOT_FOUND(res)
      } else {
        Response.OK(res, location);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

// Update single location
router.patch('/:id', (req, res) => {

  let location = mongoose.model('Location', LocationSchema);
  let updateValues = req.body;

  location.update({_id: req.params.id}, {$set: updateValues})
    .then(data => {
      if (!data) {
        Response.NOT_FOUND(res);
      } else {
        status = {
          status: data['n'] > 0 && data['nModified'] > 0,
          matched: data['n'],
          modified: data['nModified']
        };
        Response.OK(res, status);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

// Delete a location
router.delete('/:id', (req, res) => {
  Location = mongoose.model('Location', LocationSchema);
  Location
    .findByIdAndRemove(req.params.id)
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
