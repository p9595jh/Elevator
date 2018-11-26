const mongoose = require('mongoose');
const playlistSchema = new mongoose.Schema({
    id: String,
    list: Array
})

module.exports = mongoose.model('playlist', playlistSchema);
