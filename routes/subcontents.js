const mongoose = require('mongoose');
const subcontentsschema = new mongoose.Schema({
    type: String,
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

module.exports = mongoose.model('subcontent', subcontentsschema);
