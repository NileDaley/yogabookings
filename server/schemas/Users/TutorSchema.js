const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TutorSchema = new Schema({
  forename: { type: String, required: true },
  surname: { type: String, required: true },
  gender: String,
  phone: String,
  skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = TutorSchema;
