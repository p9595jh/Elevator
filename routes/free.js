var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Freeboard = require('./freeboard.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {

    Freeboard.find({}, function(err, frees) {
        var arr = new Array();
        for (var i=0; i<frees.length; i++)
            arr[i] = frees[frees.length - i - 1];

        res.render('free', {
            title: '자유게시판',
            free: arr,
            user: {
                id: req.session.userid,
                nickname: req.session.nickname
            }
        });
    });
});

module.exports = router;
