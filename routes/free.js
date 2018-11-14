var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Freeboard = require('./freeboard.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
    
    Freeboard.find().sort({num:-1}).exec(function(err, frees) {
        res.render('free', {
            title: '자유게시판',
            free: frees,
            user: {
                id: req.session.userid,
                nickname: req.session.nickname,
                stop: req.session.stop,
                joindate: req.session.joindate
            }
        });
    });
});

module.exports = router;
