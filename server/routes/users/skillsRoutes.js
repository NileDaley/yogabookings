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

router.get('/', (req, res) => {
  let Skill = mongoose.model('Skill', SkillSchema);
  Skill.find()
    .then(data => {
      response.data = data;
      res.send(response);
    })
});

router.get('/:id', (req, res) => {
  let Skill = mongoose.model('Skill', SkillSchema);
  Skill.findById(req.params.id)
    .then(data => {
      response.data = data;
      res.send(response);
    })
    .catch(err => sendError(err, res));
});

router.patch('/:id', (req, res) => {

  let Skill = mongoose.model('Skill', SkillSchema);
  let {_id, name, description} = req.body;
  Skill.update({_id}, {
    $set: {
      name,
      description
    }
  }).then(data => {
    response.data = {
      status: data['n'] > 0 && data['nModified'] > 0,
      matched: data['n'],
      modified: data['nModified']
    };
    res.json(response);
  }).catch(err => sendError(err, res));

});

module.exports = router;
