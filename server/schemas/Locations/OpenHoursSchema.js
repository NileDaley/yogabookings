const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let OpenHoursSchema = new Schema({
  isOpen: { type: Boolean, required: true },
  day: { type: String, required: true },
  open: String,
  close: String
});

module.exports = OpenHoursSchema;
