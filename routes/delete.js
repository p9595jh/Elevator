var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/free', function(req, res, next) {
    var FreeBoard = require('./freeboard.js');
    var id = req.body.id;
    var num = req.body.num;
    FreeBoard.deleteOne({num: num, id: id}, function(err, output) {
        if (err) res.status(500).json({ error: 'database failure' });
        res.redirect('../free');
    })
});

router.post('/music', function(req, res, next) {
    var MusicClass = require('./musicclass.js');
    var id = req.body.id;
    var num = req.body.num;
    MusicClass.deleteOne({num: num, id: id}, function(err, output) {
        if (err) res.status(500).json({ error: 'database failure' });
        res.redirect('../music');
    });
});

router.post('/subboard', function(req, res, next) {
    var SubContent = require('./subcontents.js');
    var id = req.body.id;
    var num = req.body.num;
    SubContent.deleteOne({num: num, id: id}, function(err, output) {
        if (err) res.status(500).json({ error: 'database failure' });
        res.redirect('../subboard?type=' + req.body.boardtype);
    });
})

router.post('/comment', function(req, res, next) {
    // var id = req.body.id;
    var num = req.body.num;
    var contentnum = req.body.contentnum;
    var boardtype = req.body.boardtype;

    if ( boardtype == 'free' ) {
        var FreeBoard = require('./freeboard.js');
        FreeBoard.findOne({num: contentnum}, function(err, output) {
            var _id = output._id;
            var comment;
            for (var i=0; i<output.comment.length; i++) {
                if ( num == output.comment[i].num ) {
                    comment = output.comment[i];
                    break;
                }
            }
            FreeBoard.updateOne({_id: _id}, {$pullAll: {comment: [comment]}}, function(err1, output1) {});
        });
    }
    else if ( boardtype == 'music' ) {
        var MusicClass = require('./musicclass.js');
        MusicClass.findOne({num: contentnum}, function(err, output) {
            var _id = output._id;
            var comment;
            for (var i=0; i<output.comment.length; i++) {
                if ( num == output.comment[i].num ) {
                    comment = output.comment[i];
                    break;
                }
            }
            MusicClass.updateOne({_id: _id}, {$pullAll: {comment: [comment]}}, function(err1, output1) {});
        });
    }
    else {
        var SubContent = require('./subcontents.js');
        SubContent.findOne({num: contentnum}, function(err, output) {
            var _id = output._id;
            var comment;
            for (var i=0; i<output.comment.length; i++) {
                if ( num == output.comment[i].num ) {
                    comment = output.comment[i];
                    break;
                }
            }
            SubContent.updateOne({_id: _id}, {$pullAll: {comment: [comment]}}, function(err1, output1) {});
        });
    }
    res.redirect("../content?type=" + boardtype + "&num=" + contentnum);
});

module.exports = router;
