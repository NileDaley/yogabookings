const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkillSchema = new Schema({
  name: String,
  description: String
});

module.exports = SkillSchema;
