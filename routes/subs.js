var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sub = require('./sub.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
    Sub.find(function(err, subs) {
        if ( req.session.userid ) {
            var User = require('./user.js');
            User.findOne({id: req.session.userid}, function(err1, users) {
                res.render('subs', {
                    title: '서브게시판',
                    sub: subs,
                    user: users
                });
            });
        }
        else {
            res.render('subs', {
                title: '서브게시판',
                sub: subs,
                user: {
                    id: req.session.userid,
                    nickname: req.session.nickname,
                    stop: req.session.stop,
                    joindate: req.session.joindate
                }
            });
        }
    });
});

module.exports = router;
