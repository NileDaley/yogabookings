const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let VenueSchema = new Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true }
});

module.exports = VenueSchema;
