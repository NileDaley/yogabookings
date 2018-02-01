const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const SkillsRoutes = require('./skillsRoutes');

const TutorSchema = require('../../schemas/Users/TutorSchema');
const UserSchema = require('../../schemas/Users/UserSchema');
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

router.use('/skills', SkillsRoutes);

router.get('/', (req, res) => {
  let Tutor = mongoose.model('Tutor', TutorSchema);
  let User = mongoose.model('User', UserSchema);
  let Skill = mongoose.model('Skill', SkillSchema);

  Tutor.find()
    .populate('user skills')
    .then(data => {
      response.data = data;
      res.send(response);
    })
    .catch(err => sendError(err, res));
});

router.get('/:id', (req, res) => {
  let Tutor = mongoose.model('Tutor', TutorSchema);
  let User = mongoose.model('User', UserSchema);
  let Skill = mongoose.model('Skill', SkillSchema);
  Tutor.findById(req.params.id)
    .populate('user skills')
    .then(data => {
      response.data = data;
      res.send(response);
    })
    .catch(err => sendError(err, res));
});

router.patch('/:id', (req, res) => {
  let Tutor = mongoose.model('Tutor', TutorSchema);
  let User = mongoose.model('User', UserSchema);
  let Skill = mongoose.model('Skill', SkillSchema);

  let newValues = req.body;
  let skills = newValues.skills.map(s => mongoose.Types.ObjectId(s._id));
  let user = mongoose.Types.ObjectId(newValues.user._id);

  let {forename, surname, phone, gender} = newValues;

  Tutor.update({_id: req.params.id},
    {
      $set: {
        skills,
        user,
        forename,
        surname,
        phone,
        gender
      }
    })
    .then(data => {
      response.data = {
        status: data['n'] > 0 && data['nModified'] > 0,
        matched: data['n'],
        modified: data['nModified']
      };
      res.json(response);
    }).catch(err => sendError(err, res));

});

module.exports = router;
