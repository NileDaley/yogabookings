const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const SkillSchema = require('../../schemas/Users/SkillSchema');

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
  let Skill = mongoose.model('Skill', SkillSchema);
  Skill.find()
    .then(data => {
      response.data = data;
      res.send(response);
    })
});

module.exports = router;
