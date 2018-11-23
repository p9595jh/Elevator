var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', function(req, res) {
    if ( req.body.boardtype == 'free' ) {
        var FreeBoard = require('./freeboard.js');
        FreeBoard.findOne({_id: req.body._id}, function(err, output) {
            var recommend = output.recommend;
            for (var i=0; i<output.recommendBy.length; i++) {
                if ( output.recommendBy[i] == req.body.id ) {
                    var responseData = { "recommend" : recommend };
                    res.json(responseData);
                    return;
                }
            }
            recommend++;
            FreeBoard.updateOne({_id: req.body._id}, {recommend: recommend}, function(err1, output1) {});
            FreeBoard.updateOne({_id: req.body._id}, {$push: {recommendBy: req.body.id}}, function(err1, output1) {});
            var responseData = { "recommend" : recommend };
            res.json(responseData);
        });
    }
    else if ( req.body.boardtype == 'music' ) {
        var MusicClass = require('./musicclass.js');
        MusicClass.findOne({_id: req.body._id}, function(err, output) {
            var grade = output.grade;
            for (var i=0; i<output.gradeby.length; i++) {
                if ( output.gradeby[i] == req.body.id ) {
                    var responseData = { "grade" : grade, "people" : output.gradeby.length };
                    res.json(responseData);
                    return;
                }
            }
            grade += req.body.count;
            var people = output.gradeby.length + 1;
            MusicClass.updateOne({_id: req.body._id}, {grade: grade}, function(err1, output1) {});
            MusicClass.updateOne({_id: req.body._id}, {$push: {gradeby: req.body.id}}, function(err1, output1) {});
            var responseData = { "grade" : grade, "people" : people };
            res.json(responseData);
        })
    }
});
router.post('/boardrequest', function(req, res) {
    var User = require('./user.js');
    User.updateOne({id: req.body.userid}, {boardRequest: 1}, function(err1, output1) {});
    var MusicClass = require('./musicclass.js');
    MusicClass.updateOne({_id: req.body._id}, {boardRequest: true}, function(err1, output1) {});
});
router.post('/acceptboardrequest', function(req, res) {
    var User = require('./user.js');
    User.updateOne({id: req.body.userid}, {boardRequest: 2}, function(err1, output1) {});
    var MusicClass = require('./musicclass.js');
    MusicClass.updateOne({_id: req.body._id}, {boardRequest: false}, function(err1, output1) {});

    var Sub = require('./sub.js');
    var sub = new Sub();
    sub.id = req.body.userid;
    sub.subscribes = new Array();
    sub.subscribes[0] = sub.id;
    sub.stops = new Array();
    sub.save(function(err) {
        if ( err ) console.log("Error while creating sub board");
        User.updateOne({id: sub.id}, {$push: {subscribes: sub.id}}, function(err1, output1) {});
    });
});

module.exports = router;
