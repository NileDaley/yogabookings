const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OpenHoursSchema = require('./OpenHoursSchema');

let LocationSchema = new Schema({
  name: String,
  address: [String],
  email: String,
  phone: String,
  openHours: [OpenHoursSchema]
});

module.exports = LocationSchema
