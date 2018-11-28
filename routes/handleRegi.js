var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('./user.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', function(req, res) {
    User.find({id: req.body.id}, function(err, users) {
        if ( err ) {
            console.log("Error in handleRegi!!!!");
            res.status(500).send({ error: 'database failure' });
            return;
        }

        var user = new User();
        user.id = req.body.id.trim();
        user.pw = req.body.password.trim();
        user.email = req.body.email.trim();
        user.nickname = req.body.nickname.trim();
        user.genre = req.body.genre.trim();
        var date = new Date();
        user.joindate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
        user.introduction = req.body.intro.trim();
        user.stop = false;
        user.boardRequest = 0;
        user.subscribes = new Array();
        user.live = '';
        
        if ( users.length !== 0 ) {
            res.render('./join', {
                title: '회원가입',
                errmsg: '이미 존재하는 ID입니다',
                user: {
                    id: req.session.userid,
                        nickname: req.session.nickname,
                        stop: req.session.stop,
                        joindate: req.session.joindate,
                        boardRequest: req.session.boardRequest
                },
                past: req.body
            });
        }
        else {
            if ( user.id == '' || user.pw == '' || user.email == '' || user.nickname == '' ) {
                res.render('./join', {
                    title: '회원가입',
                    errmsg: '* 표시된 칸은 모두 채워야 합니다',
                    user: {
                        id: req.session.userid,
                        nickname: req.session.nickname,
                        stop: req.session.stop,
                        joindate: req.session.joindate,
                        boardRequest: req.session.boardRequest
                    },
                    past: req.body
                });
            }
            else {
                var fs = require('fs-extra');
                fs.copy('public/images/noimage.jpg', 'public/images/profileimages/' + user.id, function(err0) {
                    if ( err0 ) console.err(err0);
                });
                user.save(function(err) {
                    if ( err ) {
                        res.status(500).send({ error: 'database failure' });
                        return;
                    }
                    req.session.userid = user.id;
                    req.session.nickname = user.nickname;
                    req.session.stop = user.stop;
                    req.session.joindate = user.joindate;
                    res.redirect('./start');
                });
            }
        }
    });
});
router.post('/insert', function(req, res) {
    User.find({id: req.body.id}, function(err, users) {
        if ( err ) {
            console.log("Error in handleRegi!!!!");
            res.json({id: ""});
            return;
        }

        var user = new User();
        user.id = req.body.id.trim();
        user.pw = req.body.password.trim();
        user.email = req.body.email.trim();
        user.nickname = req.body.nickname.trim();
        user.genre = req.body.genre.trim();
        var date = new Date();
        user.joindate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        user.introduction = req.body.intro.trim();
        user.stop = false;
        user.boardRequest = 0;
        user.subscribes = new Array();
        
        if ( users.length !== 0 ) {
            console.log("duplicated");
            res.json({id: ""});
            return;
        }
        var fs = require('fs-extra');
        fs.copy('public/images/noimage.jpg', 'public/images/profileimages/' + user.id, function(err0) {
            if ( err0 ) console.err(err0);
        });
        user.save(function(err) {
            if ( err ) {
                console.log("Error in handleRegi!!!!");
                res.json({id: ""});
                return;
            }
            res.send("Inserted value successfully - '" + user.id + "'");
        });
    });
});

module.exports = router;
