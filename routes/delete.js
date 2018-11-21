var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var FreeBoard = require('./freeboard.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/free', function(req, res, next) {
    var id = req.body.id;
    var num = req.body.num;
    FreeBoard.remove({num: num, id: id}, function(err, output) {
        if (err) res.status(500).json({ error: 'database failure' });
        res.redirect('../free');
    })
});

router.post('/freecomment', function(req, res, next) {
    var id = req.body.id;
    var num = req.body.num;
    var contentnum = req.body.contentnum;
    FreeBoard.findOneAndUpdate({num: contentnum}, {$pull: {comment: {num: num}}}, function(err, output) {
        console.log(output.comment);
    });
    // FreeBoard.update({num: contentnum}, {$pullAll: {num: [num]}});
    res.redirect('../content?type=free&num=' + contentnum);
});

module.exports = router;
