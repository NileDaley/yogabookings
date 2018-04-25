const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  forename: { type: String, required: true },
  surname: { type: String, required: true },
  gender: String,
  phone: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = CustomerSchema;
