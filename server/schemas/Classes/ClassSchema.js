const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  tutor: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
  attendees: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Customer' }],
    required: true
  },
  classSize: { type: Number, required: true },
  classType: { type: Schema.Types.ObjectId, ref: 'ClassType', required: true },
  price: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  venue: { type: String, required: true },
  classGroup: { type: Schema.Types.ObjectId, ref: 'ClassGroup' }
});

module.exports = ClassSchema;
