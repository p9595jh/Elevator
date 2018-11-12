const mongoose = require('mongoose');
const freeboardSchema = new mongoose.Schema({
    num: Number,
    id: String,
    nickname: String,
    hit: Number,
    title: String,
    content: String,
    recommend: Number
})

module.exports = mongoose.model('free', freeboardSchema);
