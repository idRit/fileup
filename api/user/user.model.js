const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
}, {
    timestamps: true    
});

module.exports = mongoose.model('UserSchema', userSchema);