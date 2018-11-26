var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var sizeOf = require('image-size');

var FreeBoard = require('./freeboard.js');
var MusicClass = require('./musicclass.js');
var SubContent = require('./subcontents.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
    var type = req.query.type;
    var number = req.query.num;
    const width = 700;
    const widthPercent = "70%";

    if ( type == 'free' ) {
        FreeBoard.findOne({num: number}, function(err, frees) {
            if ( err ) {
                console.log("error in content.js");
                res.status(500).send({ error: 'database failure' });
                return;
            }
            if ( req.session.userid != frees.id ) {
                var f = require('./freeboard.js');
                var hit = frees.hit + 1;
                f.updateOne({num: number}, {hit: hit}, function(err1, output) {
                    // updating hits
                });
                frees.hit = hit;
            }
            var imageWidth = widthPercent;
            if ( frees.image != '' ) {
                try {
                    var dimension = sizeOf('public/' + frees.image);
                    if ( dimension.width < width ) imageWidth = dimension.width;
                }
                catch(exception) {}
            }

            var Fb = require('./freeboard.js');
            Fb.find().sort({num:-1}).exec(function(err, all) {
                res.render('content', {
                    title: frees.title + ' - 자유게시판',
                    free: frees,
                    user: {
                        id: req.session.userid,
                        nickname: req.session.nickname,
                        stop: req.session.stop,
                        joindate: req.session.joindate,
                        boardRequest: req.session.boardRequest
                    },
                    imageWidth: imageWidth,
                    content: frees,
                    type: '자유게시판',
                    listurl: 'free',
                    boardtype: 'free',
                    all: all    // board that on below
                });
            });
        });
    }
    else if ( type == 'music' ) {
        MusicClass.findOne({num: number}, function(err, musics) {
            if ( err ) {
                console.log("error in content.js");
                res.status(500).send({ error: 'database failure' });
                return;
            }
            if ( req.session.userid != musics.id ) {
                var f = require('./musicclass.js');
                var hit = musics.hit + 1;
                f.updateOne({num: number}, {hit: hit}, function(err1, output) {});
                musics.hit = hit;
            }
            var imageWidth = widthPercent;
            if ( musics.image != '' ) {
                try {
                    var dimension = sizeOf('public/' + musics.image);
                    if ( dimension.width < width ) imageWidth = dimension.width;
                }
                catch(exception) {}
            }

            var Mc = require('./musicclass.js');
            Mc.find().sort({num:-1}).exec(function(err, all) {

                var User = require('./user.js');
                User.findOne({id: musics.id}, function(err1, output1) {
                    res.render('content', {
                        title: musics.title + ' - 음악게시판',
                        user: {
                            id: req.session.userid,
                            nickname: req.session.nickname,
                            stop: req.session.stop,
                            joindate: req.session.joindate,
                            boardRequest: req.session.boardRequest
                        },
                        imageWidth: imageWidth,
                        content: musics,
                        type: '음악게시판',
                        listurl: 'music',
                        boardtype: 'music',
                        all: all,
                        writer: output1
                    });
                });

                
            });
        });
    }
    else {
        SubContent.findOne({num: number}, function(err, subs) {
            if ( err ) {
                console.log("error in content.js");
                res.status(500).send({ error: 'database failure' });
                return;
            }
            if ( req.session.userid != subs.id ) {
                var s = require('./subcontents.js');
                var hit = subs.hit + 1;
                s.updateOne({num: number}, {hit: hit}, function(err1, output) {});
                subs.hit = hit;
            }
            var imageWidth = widthPercent;
            if ( subs.image != '' ) {
                try {
                    var dimension = sizeOf('public/' + subs.image);
                    if ( dimension.width < width ) imageWidth = dimension.width;
                }
                catch(exception) {}
            }

            var Sub = require('./sub.js');
            Sub.findOne({id: subs.type}, function(err, output) {
                var stopped = false;
                if ( req.session.userid ) {
                    for (var i=0; i<output.stops.length; i++) {
                        if ( output.stops[i] == req.session.userid ) {
                            stopped = true;
                            break;
                        }
                    }
                }
                var Sc = require('./subcontents.js');
                Sc.find({type: subs.type}).sort({num:-1}).exec(function(err, all) {
                    res.render('content', {
                        title: subs.title + ' - 서브게시판',
                        free: subs,
                        user: {
                            id: req.session.userid,
                            nickname: req.session.nickname,
                            stop: req.session.stop || stopped,
                            joindate: req.session.joindate,
                            boardRequest: req.session.boardRequest
                        },
                        imageWidth: imageWidth,
                        content: subs,
                        type: type + ' - 서브게시판',
                        listurl: 'subboard',
                        boardtype: type,
                        all: all    // board that on below
                    });
                });
            });
        });
    }

});

module.exports = router;
