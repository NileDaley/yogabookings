const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OpenHoursSchema = require('./OpenHoursSchema');
const VenueSchema = require('./VenueSchema');

let LocationSchema = new Schema({
  name: String,
  address: [String],
  email: String,
  phone: String,
  openHours: [OpenHoursSchema],
  rooms: [VenueSchema]
});

module.exports = LocationSchema
