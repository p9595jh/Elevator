var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var MusicClass = require('./musicclass.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
    
    MusicClass.find().sort({num:-1}).exec(function(err, musics) {
        res.render('music', {
            title: '음악게시판',
            music: musics,
            user: {
                id: req.session.userid,
                nickname: req.session.nickname,
                stop: req.session.stop,
                joindate: req.session.joindate,
                boardRequest: req.session.boardRequest
            }
        });
    });
});

router.get('/get-data', function(req, res) {
    MusicClass.find().sort({num:-1}).exec(function(err, musics) {
        if (err) return res.status(500).send({error: 'database failure'});
        res.send(musics);
    });
})

module.exports = router;
