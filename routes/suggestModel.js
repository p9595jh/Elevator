const mongoose = require('mongoose');
const suggestSchema = new mongoose.Schema({
    id: String,
    nickname: String,
    writedate: String,
    comment: String,
    num: Number
});

module.exports = mongoose.model('suggest', suggestSchema);
