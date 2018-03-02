const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Response = require('../../Response');

const SkillSchema = require('../../schemas/Users/SkillSchema');

router.get('/', (req, res) => {
  let Skill = mongoose.model('Skill', SkillSchema);
  Skill.find()
    .then(skills => {
      if (!skills) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, skills);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

router.post('/', (req, res) => {

  let Skill = mongoose.model('Skill', SkillSchema);
  let {name, description} = req.body;

  let skill = new Skill({
    name, description
  });

  skill.save()
    .then(newSkill => {
      if (!newSkill) {
        Response.ERROR(res, 'An error occurred whilst inserting new skill');
      } else {
        Response.CREATED(res, newSkill);
      }
    }).catch(err => Response.ERROR(res, err));
});

router.get('/:id', (req, res) => {
  let Skill = mongoose.model('Skill', SkillSchema);
  Skill.findById(req.params.id)
    .then(skill => {
      if (!skill) {
        Response.NOT_FOUND(res);
      } else {
        Response.OK(res, skill);
      }
    })
    .catch(err => Response.ERROR(res, err));
});

router.patch('/:id', (req, res) => {

  let Skill = mongoose.model('Skill', SkillSchema);
  let {_id, name, description} = req.body;

  Skill.update({_id}, {
    $set: {
      name,
      description
    }
  }).then(updatedSkill => {

    if (!updatedSkill) {
      Response.ERROR(res, 'An error occurred whilst updating the skill');
    } else {
      const status = {
        status: updatedSkill['n'] > 0 && updatedSkill['nModified'] > 0,
        matched: updatedSkill['n'],
        modified: updatedSkill['nModified']
      };
      Response.OK(res, status);
    }

  }).catch(err => Response.ERROR(res, err));

});

module.exports = router;
