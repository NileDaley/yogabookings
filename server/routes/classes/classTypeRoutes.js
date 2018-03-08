const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Response = require('../../Response');
const {authenticate, hasRole} = require('../../middleware/authentication');

const ClassTypeSchema = require('../../schemas/Classes/ClassTypeSchema');
let ClassType = mongoose.model('ClassType', ClassTypeSchema);

router.get('/', (req, res) => {
  ClassType.find()
    .then(classTypes => {
      if (!classTypes) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, classTypes);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

router.get('/:id', (req, res) => {
  ClassType.findById(req.params.id)
    .then(classType => {
      if (!classType) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, classType);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

router.post('/', authenticate, hasRole(['admin', 'tutor']), (req, res) => {

  let {name, description} = req.body;

  let classType = new ClassType({
    name,
    description
  });

  classType.save()
    .then(newClassType => {
      if (!newClassType) {
        Response.ERROR(res, 'An error occurred whilst inserting the new class type');
      } else {
        Response.CREATED(res, newClassType);
      }
    })
    .catch(err => Response.ERROR(res, err));

});

router.patch('/:id', authenticate, hasRole(['admin', 'tutor']), (req, res) => {

  let {name, description} = req.body;

  ClassType.update(
    {_id: req.params.id},
    {
      $set: {
        name,
        description
      }
    })
    .then(updatedClassType => {
      if (!updatedClassType) {
        Response.ERROR(res, 'An error occurred whilst updating the class type');
      } else {
        Response.OK(updatedClassType);
      }
    })
    .catch(err => Response.ERROR(res, err));

});

router.delete('/:id', authenticate, hasRole(['admin', 'tutor']), (req, res) => {

  ClassType.findByIdAndRemove(req.params.id)
    .then((data, err) => {
      if (err) {
        Response.ERROR(res, err)
      } else {
        Response.OK(res);
      }
    })
    .catch(err => Response.ERROR(res, err));

});

module.exports = router;
