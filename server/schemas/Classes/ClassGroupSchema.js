const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Represents a group of recurring classes
const ClassGroupSchema = new Schema({
  startDate: {
    type: String,
    required: true
  },
  interval: {
    type: String,
    enum: ['week', 'fortnight', 'month'],
    required: true
  },
  count: {
    type: Number,
    required: true,
    min: 2,
    max: 52
  }
});

module.exports = ClassGroupSchema;
