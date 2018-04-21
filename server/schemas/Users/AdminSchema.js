const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  forename: { type: String, required: true },
  surname: { type: String, required: true },
  isOwner: { type: Boolean, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = AdminSchema;
