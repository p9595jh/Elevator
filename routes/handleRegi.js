var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('./user.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', function(req, res) {
    User.find({id: req.body.id}, function(err, users) {
        var user = new User();
        user.id = req.body.id;
        user.pw = req.body.password;
        user.email = req.body.email;
        user.nickname = req.body.nickname;
        user.genre = req.body.genre;
        var date = new Date();
        user.joindate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        user.introduction = req.body.intro;
        user.stop = false;

        if ( err ) {
            console.log("Error in handleRegi!!!!");
            res.status(500).send({ error: 'database failure' });
            return;
        }
        if ( users.length !== 0 ) {
            res.render('./join', {
                title: '회원가입',
                errmsg: '이미 존재하는 ID입니다',
                user: {
                    id: req.session.userid,
                    nickname: req.session.nickname
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
                        nickname: req.session.nickname
                    },
                    past: req.body
                });
            }
            else {
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

module.exports = router;
