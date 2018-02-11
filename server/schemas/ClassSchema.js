const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  tutor: {type: Schema.Types.ObjectId, ref: 'Tutor'},
  attendees: [{type: Schema.Types.ObjectId, ref: 'Customer'}],
  classSize: Number,
  classType: {type: Schema.Types.ObjectId, ref: 'ClassType'},
  price: Number,
  startDate: Date,
  endDate: Date,
  location: {type: Schema.Types.ObjectId, ref: 'Location'},
  venue: {type: Schema.Types.ObjectId}
});

module.exports = ClassSchema;
