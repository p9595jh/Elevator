const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    id: String,
    pw: String,
    email: String,
    nickname: String,
    genre: String,
    stop: Boolean,
    joindate: String,
    introduction: String,
    image: String
})

module.exports = mongoose.model('user', userSchema);
