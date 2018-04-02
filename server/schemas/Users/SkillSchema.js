const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkillSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' }
});

module.exports = SkillSchema;
