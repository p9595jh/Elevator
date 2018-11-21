var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var FreeBoard = require('./freeboard.js');
var MusicClass = require('./musicclass.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
    var type = req.query.type;
    var number = req.query.num;

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
            var Fb = require('./freeboard.js');
            Fb.find().sort({num:-1}).exec(function(err, all) {
                res.render('content', {
                    title: frees.title + ' - 자유게시판',
                    free: frees,
                    user: {
                        id: req.session.userid,
                        nickname: req.session.nickname,
                        stop: req.session.stop,
                        joindate: req.session.joindate
                    },
                    content: frees,
                    type: '자유게시판',
                    listurl: 'free',
                    all: all
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
                f.updateOne({num: number}, {hit: hit}, function(err1, output) {
                    // updating hits
                });
                musics.hit = hit;
            }
            var Mc = require('./musicclass.js');
            Mc.find().sort({num:-1}).exec(function(err, all) {
                res.render('content', {
                    title: musics.title + ' - 음악게시판',
                    user: {
                        id: req.session.userid,
                        nickname: req.session.nickname,
                        stop: req.session.stop,
                        joindate: req.session.joindate
                    },
                    content: musics,
                    type: '음악게시판',
                    listurl: 'music',
                    all: all
                });
            });
        });
    }

});

module.exports = router;
