const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  forename: String,
  surname: String,
  isOwner: Boolean,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = AdminSchema;
