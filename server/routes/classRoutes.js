const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ClassSchema = require('../schemas/ClassSchema');
const ClassTypeSchema = require('../schemas/ClassTypeSchema');
const LocationSchema = require('../schemas/Locations/LocationSchema');
const TutorSchema = require('../schemas/Users/TutorSchema');
const CustomerSchema = require('../schemas/Users/CustomerSchema');

const classTypeRoutes = require('../routes/classes/classTypeRoutes');

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

router.use('/types', classTypeRoutes);

router.get('/', (req, res) => {
  let Location = mongoose.model('Location', LocationSchema);
  let Tutor = mongoose.model('Tutor', TutorSchema);
  let Customer = mongoose.model('Customer', CustomerSchema);
  let ClassType = mongoose.model('ClassType', ClassTypeSchema);
  let Class = mongoose.model('Class', ClassSchema);
  Class.find()
    .populate('location tutor attendees classType')
    .then(classes => {
      response.data = classes;
      res.json(response);
    })
    .catch(err => sendError(err, res));
});

router.get('/:id', (req, res) => {
  let Location = mongoose.model('Location', LocationSchema);
  let Tutor = mongoose.model('Tutor', TutorSchema);
  let Customer = mongoose.model('Customer', CustomerSchema);
  let ClassType = mongoose.model('ClassType', ClassTypeSchema);
  let Class = mongoose.model('Class', ClassSchema);
  Class.findById(req.params.id)
    .populate('location tutor attendees classType')
    .then(_class => {
      response.data = _class;
      res.json(response);
    })
    .catch(err => sendError(err, res));
});

router.post('/', (req, res) => {

  let Class = mongoose.model('Class', ClassSchema);

  let {tutor, attendees, classSize, price, classType, startDate, endDate, location, venue} = req.body;

  let newClass = new Class({
    tutor: mongoose.Types.ObjectId(tutor._id),
    attendees: attendees.map(a => mongoose.Types.ObjectId(a._id)),
    classSize,
    classType: mongoose.Types.ObjectId(classType._id),
    price,
    startDate,
    endDate,
    location: mongoose.Types.ObjectId(location._id),
    venue: mongoose.Types.ObjectId(venue._id)
  });

  newClass.save()
    .then(insertedClass => {
      response.data = insertedClass;
      response.status = 201;
      res.json(response);
      response.status = 200;
    })
    .catch(err => sendError(err, res));

});

router.patch('/:id', (req, res) => {

  let Class = mongoose.model('Class', ClassSchema);

  let {tutor, attendees, classSize, price, classType, startDate, endDate, location, venue} = req.body;

  Class.findByIdAndUpdate(req.params.id,
    {
      $set:{
        tutor: mongoose.Types.ObjectId(tutor._id),
        attendees: attendees.map(a => mongoose.Types.ObjectId(a._id)),
        classSize,
        classType: mongoose.Types.ObjectId(classType._id),
        price,
        startDate,
        endDate,
        location: mongoose.Types.ObjectId(location._id),
        venue: mongoose.Types.ObjectId(venue._id)
      }
    })
    .then(updatedClass => {
      response.data = updatedClass;
      res.json(response);
    })
    .catch(err => sendError(err,res));
});

router.delete('/:id', (req, res) => {
  let Class = mongoose.model('Class', ClassSchema);
  Class.findByIdAndRemove(req.params.id)
    .then((data, err) => {
      if (err) sendError(err, res);
      response.data = data;
      res.json(response);
      ;
    })
    .catch(err => sendError(err, res));
});

module.exports = router;
