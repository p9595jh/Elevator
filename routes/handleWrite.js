var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var FreeBoard = require('./freeboard.js');
var MusicClass = require('./musicclass.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', function(req, res) {
    if ( req.body.boardtype == "free" ) {
        FreeBoard.find({}).sort({num:-1}).exec(function(err, frees) {
            if ( err ) {
                console.log("Error in handleWrite!!!!");
                res.status(500).send({ error: 'database failure' });
                return;
            }

            var free = new FreeBoard();
            free.id = req.session.userid;
            free.nickname = req.session.nickname;
            free.title = req.body.title;
            free.content = req.body.content;
            free.tag = req.body.tag;
            if ( free.title == '' ) free.title = '#';
            if ( free.content == '' ) free.content = '#';
            
            var date = new Date();
            free.writedate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
            free.hit = 0;
            free.recommend = 0;
            if ( frees.length == 0 ) free.num = 0;
            else free.num = frees[0].num + 1;

            free.save(function(err) {
                if ( err ) {
                    res.status(500).send({ error: 'database failure' });
                    return;
                }
                res.redirect('./free');
            });
        });
    }
    else if ( req.body.boardtype == "music" ) {
        MusicClass.find({}).sort({num:-1}).exec(function(err, musics) {
            if ( err ) {
                console.log("Error in handleWrite!!!!");
                res.status(500).send({ error: 'database failure' });
                return;
            }

            var music = new MusicClass();
            music.id = req.session.userid;
            music.nickname = req.session.nickname;
            music.title = req.body.title;
            music.content = req.body.content;
            music.tag = req.body.tag;
            music.grade = 0;
            music.gradeby = new Array();
            if ( music.title == '' ) music.title = '#';
            if ( music.content == '' ) music.content = '#';
            
            var date = new Date();
            music.writedate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
            music.hit = 0;
            music.grade = 0;
            if ( musics.length == 0 ) music.num = 0;
            else music.num = musics[0].num + 1;

            music.save(function(err) {
                if ( err ) {
                    res.status(500).send({ error: 'database failure' });
                    return;
                }
                res.redirect('./music');
            });
        });
    }
});

module.exports = router;
