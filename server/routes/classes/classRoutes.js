const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
require('moment-recur');

const ClassSchema = require('../../schemas/Classes/ClassSchema');
const ClassGroupSchema = require('../../schemas/Classes/ClassGroupSchema');
const ClassTypeSchema = require('../../schemas/Classes/ClassTypeSchema');
const LocationSchema = require('../../schemas/Locations/LocationSchema');
const TutorSchema = require('../../schemas/Users/TutorSchema');
const SkillSchema = require('../../schemas/Users/SkillSchema');
const UserSchema = require('../../schemas/Users/UserSchema');
const CustomerSchema = require('../../schemas/Users/CustomerSchema');

const classTypeRoutes = require('./classTypeRoutes');
const classGroupRoutes = require('./classGroupRoutes');

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
router.use('/groups', classGroupRoutes);

router.get('/', (req, res) => {
  let Location = mongoose.model('Location', LocationSchema);
  let Tutor = mongoose.model('Tutor', TutorSchema);
  let Skill = mongoose.model('Skill', SkillSchema);
  let User = mongoose.model('User', UserSchema);
  let Customer = mongoose.model('Customer', CustomerSchema);
  let ClassType = mongoose.model('ClassType', ClassTypeSchema);
  let Class = mongoose.model('Class', ClassSchema);
  let ClassGroup = mongoose.model('ClassGroup', ClassGroupSchema);

  Class.find()
    .populate('location classType classGroup')
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
  let ClassGroup = mongoose.model('ClassGroup', ClassGroupSchema);

  Class.findById(req.params.id)
    .populate('location classType classGroup')
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
  let ClassGroup = mongoose.model('ClassGroup', ClassGroupSchema);

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

  let events = [date];

  if (repeating) {

    let m = moment(date);
    let recurrence;

    switch (repeatInterval) {
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

    // Get n - 1 recurrences ( we already have the first one from the original date )
    recurrence.next(repeatCount - 1).forEach(r => {
      events.push(r.format('YYYY-MM-DD'));
    });

    let classGroup = new ClassGroup({
      startDate: date,
      interval: repeatInterval,
      count: repeatCount
    });

    classGroup.save()
      .then(data => {
        let classGroupId = data._id;

        events = events.map(e => {
          return {
            tutor: mongoose.Types.ObjectId(tutor),
            classSize,
            classType: mongoose.Types.ObjectId(classType),
            price,
            date: e,
            startTime,
            endTime,
            location: mongoose.Types.ObjectId(location),
            venue,
            classGroup: mongoose.Types.ObjectId(classGroupId)
          }
        });

        Class.insertMany(events)
          .then(data => {
            response.data = data;
            response.status = 201;
            res.send(response);
            response.status = 200;
          })
          .catch(err => sendError(err,res));

      })
      .catch(err => sendError(err, res));

  } else {

    let newClass = new Class({
      tutor: mongoose.Types.ObjectId(tutor),
      classSize,
      classType: mongoose.Types.ObjectId(classType),
      price,
      date,
      startTime,
      endTime,
      location: mongoose.Types.ObjectId(location),
      venue
    });

    newClass.save()
      .then(insertedClass => {
        response.data = insertedClass;
        response.status = 201;
        res.json(response);
        response.status = 200;
      })
      .catch(err => sendError(err, res));

  }

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
