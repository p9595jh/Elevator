var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Notice = require('./noticeModel.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
    Notice.find().sort({num:-1}).exec(function(err, notices) {
        if ( err ) {
            console.log("Error in notice.js");
            res.status(500).send({ error: 'database failure' });
            return;
        }
        res.render('notice', {
            title: '공지사항',
            user: {
                id: req.session.userid,
                nickname: req.session.nickname,
                stop: req.session.stop,
                joindate: req.session.joindate,
                boardRequest: req.session.boardRequest
            },
            content: notices
        })
    });
});

router.get('/get-data', function(req, res) {
    Notice.find().sort({num:-1}).exec(function(err, notices) {
        if (err) return res.status(500).send({error: 'database failure'});
        res.send(notices);
    })
});

module.exports = router;
