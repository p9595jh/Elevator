const mongoose = require('mongoose');
const noticeSchema = new mongoose.Schema({
    id: String,
    nickname: String,
    writedate: String,
    comment: String,
    num: Number
});

module.exports = mongoose.model('notice', noticeSchema);
