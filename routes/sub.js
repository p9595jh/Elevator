const mongoose = require('mongoose');
const subSchema = new mongoose.Schema({
    id: String,
    subscribes: Array,
    stops: Array
})

module.exports = mongoose.model('sub', subSchema);
