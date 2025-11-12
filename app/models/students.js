// load the things we need
const mongoose = require('mongoose');

// define the schema for our user model
const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    midterm: { type: Number, required: true },
    final: { type: Number, required: true },
    average: { type: Number, required: true }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Student', StudentSchema);

