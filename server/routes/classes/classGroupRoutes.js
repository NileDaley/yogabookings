const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Response = require('../../Response');
const { authenticate, hasRole } = require('../../middleware/authentication');

const ClassGroupSchema = require('../../schemas/Classes/ClassGroupSchema');
const ClassGroup = mongoose.model('ClassGroup', ClassGroupSchema);

const ClassSchema = require('../../schemas/Classes/ClassSchema');
const Class = mongoose.model('Class', ClassSchema);

router.get('/', (req, res) => {
  ClassGroup.find()
    .then(classGroups => {
      if (!classGroups) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, classGroups);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

router.get('/:id', (req, res) => {
  Class.find({ classGroup: req.params.id })
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

router.post('/', authenticate, hasRole(['admin', 'tutor']), (req, res) => {
  let { startDate, interval, count } = req.body;

  let classGroup = new ClassGroup({
    startDate,
    interval,
    count
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
        Response.CREATED(res, insertedClassGroup);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

router.delete('/:id', authenticate, hasRole(['admin', 'tutor']), (req, res) => {
  const groupID = req.params.id;
  Class.deleteMany({ classGroup: groupID })
    .then(() => {
      ClassGroup.remove({ _id: groupID })
        .then(() => {
          Response.OK(res);
        })
        .catch(error => Response.ERROR(res, err));
    })
    .catch(error => Response.ERROR(res, error));
});

module.exports = router;
