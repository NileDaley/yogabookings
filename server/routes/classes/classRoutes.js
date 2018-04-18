const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
require('moment-recur');
const { authenticate, hasRole } = require('../../middleware/authentication');
const Response = require('../../Response');

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

const classTypeRoutes = require('./classTypeRoutes');
const classGroupRoutes = require('./classGroupRoutes');

router.use('/types', classTypeRoutes);
router.use('/groups', classGroupRoutes);

router.get('/', (req, res) => {
  Class.find()
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
      if (!classes) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, classes);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

router.get('/:id', (req, res) => {
  Class.findById(req.params.id)
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
    .then(_class => {
      if (!_class) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, _class);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

router.post('/', authenticate, hasRole(['admin', 'tutor']), (req, res) => {
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
        recurrence = m.recur().every(1, 'weeks');
        break;
      }
      case 'fortnight': {
        recurrence = m.recur().every(2, 'weeks');
        break;
      }
      case 'month': {
        recurrence = m.recur().every(1, 'months');
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

    classGroup
      .save()
      .then(insertedClassGroup => {
        if (!insertedClassGroup) {
          Response.ERROR(
            res,
            'An error occurred whilst inserting the class group'
          );
        } else {
          let classGroupId = insertedClassGroup._id;

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
            };
          });

          Class.insertMany(events)
            .then(insertedClasses => {
              if (!insertedClasses) {
                Response.ERROR(
                  res,
                  'An error occurred whilst inserting the classes'
                );
              } else {
                Response.CREATED(res, insertedClasses);
              }
            })
            .catch(err => Response.ERROR(res, err));
        }
      })
      .catch(err => Response.ERROR(res, err));
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

    newClass
      .save()
      .then(insertedClass => {
        if (!insertedClass) {
          Response.ERROR(res, 'An error occurred whilst inserting the class');
        } else {
          Response.CREATED(res, insertedClass);
        }
      })
      .catch(err => Response.ERROR(res, err));
  }
});

router.patch('/:id', authenticate, hasRole(['admin', 'tutor']), (req, res) => {
  let {
    tutor,
    attendees,
    classSize,
    price,
    classType,
    date,
    startTime,
    endTime,
    location,
    venue
  } = req.body;

  Class.findByIdAndUpdate(req.params.id, {
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
      if (!updatedClass) {
        Response.ERROR(res, 'An error occurred whilst updating the class');
      } else {
        Response.OK(res, updatedClass);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

router.post(
  '/cancel',
  authenticate,
  hasRole(['admin', 'tutor']),
  (req, res) => {
    const { classes } = req.body;
    const promises = classes.map(c => Class.remove({ _id: c }));
    Promise.all(promises)
      .then(data => {
        Response.OK(res, data);
      })
      .catch(err => {
        Response.ERROR(res, err);
      });
  }
);

router.delete('/:id', authenticate, hasRole(['admin', 'tutor']), (req, res) => {
  Class.remove({ _id: req.params.id })
    .then(response => Response.OK(res, response))
    .catch(error => Response.ERROR(res, error));
});

module.exports = router;
