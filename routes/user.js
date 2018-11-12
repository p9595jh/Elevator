const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    id: String,
    pw: String,
    email: String,
    nickname: String,
    genre: String,
    stop: Boolean,
    date: String,
    introduction: String
})

module.exports = mongoose.model('user', userSchema);
