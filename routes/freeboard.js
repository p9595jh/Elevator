const mongoose = require('mongoose');
const freeboardSchema = new mongoose.Schema({
    num: Number,
    id: String,
    nickname: String,
    hit: Number,
    title: String,
    content: String,
    writedate: String,
    recommend: Number,
    recommendBy: Array,
    comment: Array,
    tag: String,
    image: String,
    audio: String
})

module.exports = mongoose.model('free', freeboardSchema);
