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

router.post('/freecomment', function(req, res, next) {
    var id = req.body.id;
    var num = req.body.num;
    var contentnum = req.body.contentnum;
    FreeBoard.findOneAndUpdate({num: contentnum}, {$pull: {comment: {$elemMatch: {num: num}}}}, function(err, output) {
        if (err) console.log("Error on deletion");
        console.log(output);
    });
    var c = "<span style='color:red;'>삭제된 댓글입니다</span>";
    // FreeBoard.findOneAndUpdate({num: contentnum, comment: {$elemMatch: {num: num}}}, {$set: {"comment.$.comment": c}}, function(err, doc) {
    //     console.log(doc);
    // });
    // FreeBoard.findOne({num: contentnum}, function(err, output) {
    //     for (var i=0; i<output.comment.length; i++) {
    //         if ( output.comment[i].num == num ) {
    //             console.log(output.comment[i]);
    //             break;
    //         }
    //     }
    // });

    res.redirect('../content?type=free&num=' + contentnum);
});

module.exports = router;
