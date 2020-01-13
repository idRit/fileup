const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    email: String,
    token: String
}, {
    timestamps: true    
});

module.exports = mongoose.model('TokenSchema', tokenSchema);