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
            grade += req.body.count * 1;
            var people = output.gradeby.length + 1;
            MusicClass.updateOne({_id: req.body._id}, {grade: grade}, function(err1, output1) {});
            MusicClass.updateOne({_id: req.body._id}, {$push: {gradeby: req.body.id}}, function(err1, output1) {});
            var responseData = { "grade" : grade, "people" : people };
            res.json(responseData);
        })
    }
    else {
        var SubContent = require('./subcontents.js');
        SubContent.findOne({_id: req.body._id}, function(err, output) {
            var recommend = output.recommend;
            for (var i=0; i<output.recommendBy.length; i++) {
                if ( output.recommendBy[i] == req.body.id ) {
                    var responseData = { "recommend" : recommend };
                    res.json(responseData);
                    return;
                }
            }
            recommend++;
            SubContent.updateOne({_id: req.body._id}, {recommend: recommend}, function(err1, output1) {});
            SubContent.updateOne({_id: req.body._id}, {$push: {recommendBy: req.body.id}}, function(err1, output1) {});
            var responseData = { "recommend" : recommend };
            res.json(responseData);
        });
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
    sub.subscribes[0] = 'admin';
    sub.subscribes[1] = sub.id;
    sub.stops = new Array();
    sub.save(function(err) {
        if ( err ) console.log("Error while creating sub board");
        User.updateOne({id: sub.id}, {$push: {subscribes: sub.id}}, function(err1, output1) {});
        User.updateOne({id: 'admin'}, {$push: {subscribes: sub.id}}, function(err1, output1) {});
    });
});
router.post('/subscribeboard', function(req, res) {
    var userid = req.body.userid;
    var subid = req.body.subid;

    var User = require('./user.js');
    User.findOne({id: userid}, function(err, output) {
        for (var i=0; i<output.subscribes.length; i++) {
            if ( output.subscribes[i] == subid ) {
                var responseData = { "message" : "duplicated" };
                res.json(responseData);
                return;
            }
        }

        User.updateOne({id: userid}, {$push: {subscribes: subid}}, function(err1, output1) {});
        var Sub = require('./sub.js');
        Sub.updateOne({id: subid}, {$push: {subscribes: userid}}, function(err1, output1) {});
        var responseData = { "message" : "done" };
        res.json(responseData);
    });
});
router.post('/stop', function(req, res) {
    if ( req.session.userid != 'admin' ) {
        console.log('not admin');
        return;
    }

    var userid = req.body.userid;
    var User = require('./user.js');

    User.findOne({id: userid}, function(err, output) {
        User.updateOne({id: userid}, {stop: !output.stop}, function(err1, output1) {
            if ( !err1 ) {
                var responseData = { "stop" : !output.stop, "message" : "done" };
                res.json(responseData);
            }
        });
    });
});
router.post('/substop', function(req, res) {
    if ( req.session.userid != req.body.boardtype ) {
        console.log('not board admin');
        return;
    }

    var boardtype = req.body.boardtype;
    var userid = req.body.userid;
    var Sub = require('./sub.js');
    Sub.findOne({id: boardtype}, function(err, sub) {
        var stopped = false;
        var num = -1;
        var _id = sub._id;
        for (var i=0; i<sub.stops.length; i++) {
            if ( userid == sub.stops[i] ) {
                stopped = true;
                num = i;
                break;
            }
        }

        if ( stopped ) {
            // logic to remove userid from sub.stops
            Sub.updateOne({_id: _id}, {$pullAll: {stops: [userid]}}, function(err1, output1) {
                if ( !err1 ) {
                    var responseData = { "stop" : false, "message" : "done" };
                    res.json(responseData);
                }
            });
        }
        else {
            Sub.updateOne({id: boardtype}, {$push: {stops: userid}}, function(err1, output1) {
                if ( !err1 ) {
                    var responseData = { "stop" : true, "message" : "done" };
                    res.json(responseData);
                }
            });
        }
    });
});
router.post('/find', function(req, res) {
    var type = req.body.type;
    var code = req.body.code;
    var User = require('./user.js');
    User.findOne({_id: code}, function(err, output) {
        if ( err || !output ) {
            var responseData = { "result" : "찾기에 실패하였습니다." };
            res.json(responseData);
        }
        else if ( type == 'id' ) {
            var responseData = { "result" : output.id };
            res.json(responseData);
        }
        else if ( type == 'pw' ) {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var string_length = 15;
            var randomstring = '';
            for (var i=0; i<string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum,rnum+1);
            }
            User.updateOne({_id: code}, {pw: randomstring}, function(err1, output1) {
                if ( err1 ) {
                    var responseData = { "result" : "찾기에 실패하였습니다." };
                    res.json(responseData);
                }
                else {
                    var responseData = { "result" : "비밀번호가 " + randomstring + " 으로 변경되었습니다." };
                    res.json(responseData);
                }
            });
        }
        else console.log("???????????");
    });
});
router.post('/reserve', function(req, res) {
    var subid = req.body.subid;
    var userid = req.body.userid;

    var User = require('./user.js');
    var Sub = require('./sub.js');
    Sub.findOne({id: subid}, function(err, sub) {
        if ( sub.liveticket.length == sub.liveviewer.length ) {
            var responseData = { "result" : "남는 자리가 없습니다" };
            res.json(responseData);
            return;
        }
        for (var i=0; i<sub.liveviewer.length; i++) {
            if ( sub.liveviewer[i].id == userid ) {
                var responseData = { "result" : "이미 신청하셨습니다" };
                res.json(responseData);
                return;
            }
        }
        var key = sub.liveticket[sub.liveviewer.length];
        Sub.updateOne({id: subid}, {$push: {liveviewer: {id: userid, ticket: key}}}, function(err, output) {});
        User.updateOne({id: userid}, {live: key}, function(err, output) {});
        var responseData = { "result" : "done" };
        res.json(responseData);
    });
});

module.exports = router;
