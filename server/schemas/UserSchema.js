const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  forename: String,
  surname: String,
  email: String,
  password: String,
  role: Number
});

module.exports = UserSchema;
