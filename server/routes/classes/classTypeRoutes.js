const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ClassTypeSchema = require('../../schemas/ClassTypeSchema');
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

router.get('/', (req, res) => {
  let ClassType = mongoose.model('ClassType', ClassTypeSchema);
  ClassType.find()
    .then(classTypes => {
      response.data = classTypes;
      res.json(response);
    })
    .catch(err => sendError(err, res));
});

router.get('/:id', (req, res) => {
  let ClassType = mongoose.model('ClassType', ClassTypeSchema);
  ClassType.findById(req.params.id)
    .then(classType => {
      response.data = classType;
      res.json(response);
    })
    .catch(err => sendError(err, res));
});

router.post('/', (req, res) => {
  let ClassType = mongoose.model('ClassType', ClassTypeSchema);

  let {name, description} = req.body;

  let classType = new ClassType({
    name,
    description
  });

  classType.save()
    .then(newClassType => {
      response.data = newClassType;
      response.status = 201;
      res.json(response);
      response.status = 200;
    })
    .catch(err => sendError(err, res));
});

router.patch('/:id', (req, res) => {
  let ClassType = mongoose.model('ClassType', ClassTypeSchema);
  let {name, description} = req.body;
  ClassType.update(
    {_id: req.params.id},
    {
      $set: {
        name,
        description
      }
    }
  ).then(updatedClassType => {
    response.data = updatedClassType;
    res.json(response);
  }).catch(err => sendError(err, res));
});

router.delete('/:id', (req, res) => {
  let ClassType = mongoose.model('ClassType', ClassTypeSchema);
  ClassType.findByIdAndRemove(req.params.id)
    .then((data, err) => {
      if (err) sendError(err, res);
      response.data = data;
      res.send(response);
    })
    .catch(err => sendError(err,res));
});

module.exports = router;
