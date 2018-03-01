const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ClassGroupSchema = require('../../schemas/Classes/ClassGroupSchema');

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
router.get('/', (req,res) => {
  let ClassGroup = mongoose.model('ClassGroup', ClassGroupSchema);
  ClassGroup.find()
    .then(data => {
      response.data = data;
      response.status = 200;
      res.json(response);
    })
    .catch(err => sendError(err,res));
});
router.post('/', (req,res) => {

  let { startDate, interval, count } = req.body;
  let ClassGroup = mongoose.model('ClassGroup', ClassGroupSchema);

  let classGroup = new ClassGroup({
    startDate,
    interval,
    count
  });

  classGroup.save()
    .then(data => {
      response.data = data;
      response.status = 201;
      res.json(response);
      response.status = 200;
    })
    .catch(err => sendError(err,res));
});

module.exports = router;
