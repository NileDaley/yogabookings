const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let VenueSchema = new Schema({
  name: String,
  capacity: Number
});

module.exports = VenueSchema;
