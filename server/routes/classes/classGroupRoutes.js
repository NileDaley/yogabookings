const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Response = require('../../Response');
const { authenticate, hasRole } = require('../../middleware/authentication');

const ClassGroupSchema = require('../../schemas/Classes/ClassGroupSchema');
let ClassGroup = mongoose.model('ClassGroup', ClassGroupSchema);

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

module.exports = router;
