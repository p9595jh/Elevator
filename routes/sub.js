const mongoose = require('mongoose');
const subSchema = new mongoose.Schema({
    id: String,
    subscribes: Array,
    stops: Array,
    liveticket: Array,
    livedate: String,
    liveviewer: Array,
    liveintro: String,
    livetitle: String,
    livelocation: String
    // number of live viewer is liveticket.length
})

module.exports = mongoose.model('sub', subSchema);
