const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  tutor: {type: Schema.Types.ObjectId, ref: 'Tutor'},
  attendees: [{type: Schema.Types.ObjectId, ref: 'Customer'}],
  classSize: Number,
  classType: {type: Schema.Types.ObjectId, ref: 'ClassType'},
  price: String,
  date: String,
  startTime: String,
  endTime: String,
  location: {type: Schema.Types.ObjectId, ref: 'Location'},
  venue: String
});

module.exports = ClassSchema;
