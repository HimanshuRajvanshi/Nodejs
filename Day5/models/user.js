var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    FirstName: {
        type: String
    },
    LastName: {
        type: String
    },
    SSN: {
        type: String
    },
    Grade: {
        type: String
    },
    phone: {
        type: String
    }
});

module.exports = mongoose.model('users', userSchema);