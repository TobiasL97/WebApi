const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    firstName: {type: String, required: [true, 'Please enter a first name']},
    lastName: {type: String, required: [true, 'Please enter a last name']},
    email: {type: String, required: [true, 'Please enter an email'], unique: true},
    password: {type: String, required: [true, 'Please enter a password']},
})

module.exports = mongoose.model('users', userSchema)