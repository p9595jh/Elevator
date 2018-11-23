const mongoose = require('mongoose');
const freeboardSchema = new mongoose.Schema({
    num: Number,
    id: String,
    nickname: String,
    hit: Number,
    title: String,
    content: String,
    writedate: String,
    grade: Number,
    gradeby: Array,
    comment: Array,
    tag: String,
    image: String,
    audio: String,
    boardRequest: Boolean
})

module.exports = mongoose.model('music', freeboardSchema);
