var express = require('express');
var router = express.Router();
var Sub = require('./sub.js');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/make', function(req, res) {
    Sub.findOne({id: req.query.userid}, function(err, sub) {
        if ( err ) {
            console.log("error!!!!");
            res.status(500).send({ error: 'database failure' });
            return;
        }
        else {
            res.render('makelive', {
                title: req.query.userid,
                sub: sub
            })
        }
    });
});

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/apply', function(req, res) {
    var title = req.body.title;
    var date = req.body.date;
    var location = req.body.location;
    var num = req.body.num;
    var introduction = req.body.introduction;
    if ( title == '' || date == '' || location == '' ) {
        res.send('제목, 날짜, 장소는 꼭 채워야 합니다!');
        return;
    }
    var viewer = new Array();
    var ticket = new Array();
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 15;
    var randomstring = '';
    for (var i=0; i<num; i++) {
        for (var j=0; j<string_length; j++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum+1);
        }
        ticket.push(randomstring);
        randomstring = '';
    }
    Sub.updateOne({id: req.session.userid}, { livetitle: title, livedate: date, livelocation: location, liveintro: introduction, liveticket: ticket, liveviewer: viewer }, function(err, sub) {
        if ( err ) {
            console.log("error!!!!");
            res.status(500).send({ error: 'database failure' });
            return;
        }
        else {
            res.send('생성 완료');
        }
    });
});

router.get('/view', function(req, res) {
    Sub.findOne({id: req.query.userid}, function(err, sub) {
        if ( err ) {
            console.log("error!!!!");
            res.status(500).send({ error: 'database failure' });
            return;
        }
        else {
            res.render('viewlive', {
                title: req.query.userid,
                sub: sub,
                user: {
                    id: req.session.userid,
                    nickname: req.session.nickname,
                    stop: req.session.stop,
                    joindate: req.session.joindate,
                    boardRequest: req.session.boardRequest
                }
            })
        }
    });
});

module.exports = router;
