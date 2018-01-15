const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LocationSchema = new Schema({
  name: String,
  location: [String],
  email: String,
  phone: String
});

module.exports = LocationSchema
