const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Represents a group of recurring classes
const ClassGroupSchema = new Schema({
  startDate: String,
  interval: {
    type: String,
    enum: ['week', 'fortnight', 'month']
  },
  count: Number
});

module.exports = ClassGroupSchema;
