const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
require('moment-recur');

const ClassSchema = require('../../schemas/Classes/ClassSchema');
const ClassTypeSchema = require('../../schemas/Classes/ClassTypeSchema');
const LocationSchema = require('../../schemas/Locations/LocationSchema');
const TutorSchema = require('../../schemas/Users/TutorSchema');
const SkillSchema = require('../../schemas/Users/SkillSchema');
const UserSchema = require('../../schemas/Users/UserSchema');
const CustomerSchema = require('../../schemas/Users/CustomerSchema');

const classTypeRoutes = require('./classTypeRoutes');

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
  let Skill = mongoose.model('Skill', SkillSchema);
  let User = mongoose.model('User', UserSchema);
  let Customer = mongoose.model('Customer', CustomerSchema);
  let ClassType = mongoose.model('ClassType', ClassTypeSchema);
  let Class = mongoose.model('Class', ClassSchema);
  Class.find()
    .populate('location classType')
    .populate({
      path: 'tutor',
      populate: [
        {
          path: 'user',
          select: 'email'
        }, {
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
      response.data = classes;
      res.json(response);
    })
    .catch(err => sendError(err, res));
});

router.get('/:id', (req, res) => {
  let Location = mongoose.model('Location', LocationSchema);
  let Tutor = mongoose.model('Tutor', TutorSchema);
  let Skill = mongoose.model('Skill', SkillSchema);
  let User = mongoose.model('User', UserSchema);
  let Customer = mongoose.model('Customer', CustomerSchema);
  let ClassType = mongoose.model('ClassType', ClassTypeSchema);
  let Class = mongoose.model('Class', ClassSchema);
  Class.findById(req.params.id)
    .populate('location classType')
    .populate({
      path: 'tutor',
      populate: [
        {
          path: 'user',
          select: 'email'
        }, {
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
      response.data = classes;
      res.json(response);
    })
    .catch(err => sendError(err, res));
});

router.post('/', (req, res) => {

  let Class = mongoose.model('Class', ClassSchema);

  let {
    tutor,
    classSize,
    price,
    classType,
    date,
    startTime,
    endTime,
    location,
    venue,
    repeating,
    repeatInterval,
    repeatCount
  } = req.body;

  if (repeating) {

    let m = moment(date);
    let recurrence;

    switch(repeatInterval){
      case 'week': {
        recurrence = m.recur().every(1, "weeks");
        break;
      }
      case 'fortnight': {
        recurrence = m.recur().every(2, "weeks");
        break;
      }
      case 'month': {
        recurrence = m.recur().every(1, "months");
        break;
      }
    }

    let events = recurrence.next(repeatCount);
    events.forEach(event => console.log(event.format("YYYY-MM-DD")));

    /*
      TODO: [Recurring Classes] Create class group schema
      TODO: [Recurring Classes] Create class group api route
      TODO: [Recurring Classes] Save class group, then save a class for each of the dates, with a ref to the class group
     */
  }

/*  let newClass = new Class({
    tutor: mongoose.Types.ObjectId(tutor),
    classSize,
    classType: mongoose.Types.ObjectId(classType),
    price,
    date,
    startTime,
    endTime,
    location: mongoose.Types.ObjectId(location),
    venue
  });*/

  res.json({});
  /*newClass.save()
    .then(insertedClass => {
      response.data = insertedClass;
      response.status = 201;
      res.json(response);
      response.status = 200;
    })
    .catch(err => sendError(err, res));*/

});

router.patch('/:id', (req, res) => {

  let Class = mongoose.model('Class', ClassSchema);

  let {tutor, attendees, classSize, price, classType, date, startTime, endTime, location, venue} = req.body;

  Class.findByIdAndUpdate(req.params.id,
    {
      $set: {
        tutor: mongoose.Types.ObjectId(tutor._id),
        attendees: attendees.map(a => mongoose.Types.ObjectId(a._id)),
        classSize,
        classType: mongoose.Types.ObjectId(classType._id),
        price,
        date,
        startTime,
        endTime,
        location: mongoose.Types.ObjectId(location._id),
        venue: mongoose.Types.ObjectId(venue._id)
      }
    })
    .then(updatedClass => {
      response.data = updatedClass;
      res.json(response);
    })
    .catch(err => sendError(err, res));
});

router.delete('/:id', (req, res) => {
  let Class = mongoose.model('Class', ClassSchema);
  Class.findByIdAndRemove(req.params.id)
    .then((data, err) => {
      if (err) sendError(err, res);
      response.data = data;
      res.json(response);
    })
    .catch(err => sendError(err, res));
});

module.exports = router;
