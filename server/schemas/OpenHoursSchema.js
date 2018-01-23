const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let OpenHoursSchema = new Schema({
 isOpen: Boolean,
 day: String,
 open: String,
 close: String
});

module.exports = OpenHoursSchema
