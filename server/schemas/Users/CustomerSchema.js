const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  forename: String,
  surname: String,
  gender: String,
  phone: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = CustomerSchema;
