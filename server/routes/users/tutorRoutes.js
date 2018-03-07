const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Response = require('../../Response');

const SkillsRoutes = require('./skillsRoutes');

const TutorSchema = require('../../schemas/Users/TutorSchema');
const UserSchema = require('../../schemas/Users/UserSchema');
const SkillSchema = require('../../schemas/Users/SkillSchema');

let Tutor = mongoose.model('Tutor', TutorSchema);
let User = mongoose.model('User', UserSchema);
let Skill = mongoose.model('Skill', SkillSchema);

router.use('/skills', SkillsRoutes);

// Get all tutors
// TODO: isAdminOrTutor
router.get('/', (req, res) => {

  Tutor.find()
    .populate('user skills')
    .then(tutor => {
      if (!tutor) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, tutor);
      }
    })
    .catch(err => Response.ERROR(res, err));

});

// TODO: isAdmin
router.post('/', (req, res) => {

  let values = req.body;
  let {forename, surname, gender, phone} = values;

  let user = new User(values.user);
  user.save()
    .then(newUser => {

      if (!newUser) {
        Response.ERROR(res, 'An error occurred whilst inserting the new user');
      } else {

        const userID = mongoose.Types.ObjectId(newUser._id);
        const skills = values.skills.map(skill => mongoose.Types.ObjectId(skill._id));

        let tutor = new Tutor({
          forename,
          surname,
          gender,
          phone,
          skills,
          user: userID
        });

        tutor.save()
          .then(newTutor => {

            if (!newTutor) {
              Response.ERROR(res, 'An error occurred whilst inserting the new tutor');
            } else {
              Response.CREATED(res, newTutor);
            }

          })
          .catch(err => {
            Response.ERROR(res, err);
          })

      }

    })
    .catch(err => Response.ERROR(res, err));

});

// Get single tutor
router.get('/:id', (req, res) => {
  Tutor.findById(req.params.id)
    .populate('user skills')
    .then(tutors => {
      if (!tutors) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, tutors);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

// Update tutor
// TODO: isAdmin or isSelf
router.patch('/:id', (req, res) => {

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
    .then(updatedTutor => {
      if (!updatedTutor) {
        Response.ERROR(res, 'An error occurred whilst updating the tutor');
      } else {
        const status = {
          status: updatedTutor['n'] > 0 && updatedTutor['nModified'] > 0,
          matched: updatedTutor['n'],
          modified: updatedTutor['nModified']
        };
        Response.OK(res, status);
      }
    }).catch(err => Response.ERROR(res, err));

});

module.exports = router;
