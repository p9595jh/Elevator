var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var FreeBoard = require('./freeboard.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
    var type = req.query.type;
    var number = req.query.num;

    if ( type == 'free' ) {
        FreeBoard.findOne({num: number}, function(err, frees) {
            if ( err ) {
                console.log("error in content.js");
                res.status(500).send({ error: 'database failure' });
                return;
            }
            console.log(frees);

            res.render('content', {
                title: frees.title + ' - 자유게시판',
                user: {
                    id: req.session.userid,
                    nickname: req.session.nickname,
                    stop: req.session.stop,
                    joindate: req.session.joindate
                },
                content: frees,
                type: '자유게시판',
                listurl: './free'
            });
        });
    }

});

module.exports = router;
