var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var mongoose = require('mongoose');
var fs = require('fs-extra');

var FreeBoard = require('./freeboard.js');
var MusicClass = require('./musicclass.js');
var SubContent = require('./subcontents.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.post('/', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var boardtype = fields.boardtype;

        // to free board
        if ( boardtype == "free" ) {
            FreeBoard.find({}).sort({num:-1}).exec(function(err, frees) {
                if ( err ) {
                    console.log("Error in handleWrite!!!!");
                    res.status(500).send({ error: 'database failure' });
                    return;
                }

                var free = new FreeBoard();
                free.id = req.session.userid;
                free.nickname = req.session.nickname;
                free.title = fields.title;
                free.content = fields.content;
                free.tag = fields.tag;
                if ( free.title == '' ) free.title = '#';
                if ( free.content == '' ) free.content = '#';
                
                var date = new Date();
                free.writedate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
                free.hit = 0;
                free.recommend = 0;
                if ( frees.length == 0 ) free.num = 0;
                else free.num = frees[0].num + 1;

                var imagePath = '';
                var audioPath = '';
                if ( files.image.name != '' ) {
                    console.log(files.image.type);
                    var ext = files.image.name.substring(files.image.name.lastIndexOf('.')).toLowerCase();
                    if ( ext == '.jpg' || ext == '.jpeg' || ext == '.png' || ext == '.gif' ) {
                        imagePath = 'images/contentimages/' + 'free_' + free.num + '_' + req.session.userid + ext;
                        fs.copy(files.image.path, 'public/' + imagePath, function(err0) {
                            if ( err0 ) console.err(err0);
                        });
                    }
                }
                if ( files.audio.name != '' ) {
                    var ext = files.audio.name.substring(files.audio.name.lastIndexOf('.')).toLowerCase();
                    if ( ext == '.mp3' || ext == '.ogg' || ext == '.wav' ) {
                        audioPath = 'audios/contentaudios/' + 'free_' + free.num + '_' + req.session.userid + ext;
                        fs.copy(files.audio.path, 'public/' + audioPath, function(err0) {
                            if ( err0 ) console.err(err0);
                        });
                    }
                }
                free.image = imagePath;
                free.audio = audioPath;

                free.save(function(err) {
                    if ( err ) {
                        res.status(500).send({ error: 'database failure' });
                        return;
                    }
                    res.redirect('./content?type=free&num=' + free.num);
                });
            });
        }
        // to music board
        else if ( boardtype == "music" ) {
            if ( files.audio.name == '' ) {
                console.log("No music file");
                res.redirect('./music');
                return;
            }

            MusicClass.find({}).sort({num:-1}).exec(function(err, musics) {
                if ( err ) {
                    console.log("Error in handleWrite!!!!");
                    res.status(500).send({ error: 'database failure' });
                    return;
                }

                var music = new MusicClass();
                music.id = req.session.userid;
                music.nickname = req.session.nickname;
                music.title = fields.title;
                music.content = fields.content;
                music.tag = fields.tag;
                music.grade = 0;
                music.gradeby = new Array();
                music.boardRequest = false;
                if ( music.title == '' ) music.title = '#';
                if ( music.content == '' ) music.content = '#';
                
                var date = new Date();
                music.writedate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
                music.hit = 0;
                music.grade = 0;
                if ( musics.length == 0 ) music.num = 0;
                else music.num = musics[0].num + 1;

                var imagePath = '';
                var audioPath = '';
                if ( files.image.name != '' ) {
                    var ext = files.image.name.substring(files.image.name.lastIndexOf('.')).toLowerCase();
                    if ( ext == '.jpg' || ext == '.jpeg' || ext == '.png' || ext == '.gif' ) {
                        imagePath = 'images/contentimages/' + 'music_' + music.num + '_' + req.session.userid + ext;
                        fs.copy(files.image.path, 'public/' + imagePath, function(err0) {
                            if ( err0 ) console.err(err0);
                        });
                    }
                }
                if ( files.audio.name != '' ) {
                    var ext = files.audio.name.substring(files.audio.name.lastIndexOf('.')).toLowerCase();
                    if ( ext == '.mp3' || ext == '.ogg' || ext == '.wav' ) {
                        audioPath = 'audios/contentaudios/' + 'music_' + music.num + '_' + req.session.userid + ext;
                        fs.copy(files.audio.path, 'public/' + audioPath, function(err0) {
                            if ( err0 ) console.err(err0);
                        });
                    }
                }
                music.image = imagePath;
                music.audio = audioPath;

                music.save(function(err) {
                    if ( err ) {
                        res.status(500).send({ error: 'database failure' });
                        return;
                    }
                    res.redirect('./content?type=music&num=' + music.num);
                });
            });
        }
        // to sub board
        else {
            SubContent.find({}).sort({num:-1}).exec(function(err, subs) {
                if ( err ) {
                    console.log("Error in handleWrite!!!!");
                    res.status(500).send({ error: 'database failure' });
                    return;
                }

                var sub = new SubContent();
                sub.type = boardtype;
                sub.id = req.session.userid;
                sub.nickname = req.session.nickname;
                sub.title = fields.title;
                sub.content = fields.content;
                sub.tag = fields.tag;
                if ( sub.title == '' ) sub.title = '#';
                if ( sub.content == '' ) sub.content = '#';
                
                var date = new Date();
                sub.writedate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
                sub.hit = 0;
                sub.recommend = 0;
                if ( subs.length == 0 ) sub.num = 0;
                else sub.num = subs[0].num + 1;

                var imagePath = '';
                var audioPath = '';
                if ( files.image.name != '' ) {
                    console.log(files.image.type);
                    var ext = files.image.name.substring(files.image.name.lastIndexOf('.')).toLowerCase();
                    if ( ext == '.jpg' || ext == '.jpeg' || ext == '.png' || ext == '.gif' ) {
                        imagePath = 'images/contentimages/' + boardtype + '_' + sub.num + '_' + req.session.userid + ext;
                        fs.copy(files.image.path, 'public/' + imagePath, function(err0) {
                            if ( err0 ) console.err(err0);
                        });
                    }
                }
                if ( files.audio.name != '' ) {
                    var ext = files.audio.name.substring(files.audio.name.lastIndexOf('.')).toLowerCase();
                    if ( ext == '.mp3' || ext == '.ogg' || ext == '.wav' ) {
                        audioPath = 'audios/contentaudios/' + boardtype + '_' + sub.num + '_' + req.session.userid + ext;
                        fs.copy(files.audio.path, 'public/' + audioPath, function(err0) {
                            if ( err0 ) console.err(err0);
                        });
                    }
                    if ( req.session.userid == boardtype ) {
                        var Playlist = require('./playlist.js');
                        var data = { "title" : sub.title, "path" : audioPath };
                        Playlist.findOne({id: req.session.userid}, function(err1, output1) {
                            if ( !output1 ) {
                                console.log(output1);
                                var pl = new Playlist();
                                pl.id = req.session.userid;
                                pl.list = new Array();
                                pl.list[0] = data;
                                pl.save(function(err2) {});
                            }
                            else
                                Playlist.updateOne({id: req.session.userid}, {$push: {list: data}}, function(err2, output2) {});
                        });
                    }
                }
                sub.image = imagePath;
                sub.audio = audioPath;

                sub.save(function(err) {
                    if ( err ) {
                        res.status(500).send({ error: 'database failure' });
                        return;
                    }
                    res.redirect('./content?type=' + boardtype + '&num=' + sub.num);
                });
            });
        }

    });
});

module.exports = router;
