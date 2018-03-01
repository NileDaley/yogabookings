const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassTypeSchema = new Schema({
  name: String,
  description: String
});

module.exports = ClassTypeSchema;
