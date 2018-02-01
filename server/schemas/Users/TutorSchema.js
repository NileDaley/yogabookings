const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TutorSchema = new Schema({
  forename: String,
  surname: String,
  gender: String,
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = TutorSchema;
