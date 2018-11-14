var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var FreeBoard = require('./freeboard.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
    var number = req.query.num;
    FreeBoard.findOne({num: number}, function(err, frees) {
        
    });
});

module.exports = router;
