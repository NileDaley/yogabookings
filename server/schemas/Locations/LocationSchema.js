const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OpenHoursSchema = require('./OpenHoursSchema');
const VenueSchema = require('./VenueSchema');

let LocationSchema = new Schema({
  name: { type: String, required: true },
  address: { type: [String], required: true },
  email: { type: String, required: true },
  phone: String,
  openHours: { type: [OpenHoursSchema], required: true },
  venues: { type: [VenueSchema], required: true }
});

module.exports = LocationSchema;
