var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sub = require('./sub.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
    if ( req.session.boardRequest != 2 ) {
        console.log("invalid access");
        return;
    }

    Sub.findOne({id: req.session.userid}, function(err, output) {
        var clean = new Array();
        loop1: for (var i=0; i<output.subscribes.length; i++) {
            for (var j=0; j<output.stops.length; j++) {
                if ( output.subscribes[i] == output.stops[j] )
                    continue loop1;
            }
            clean.push(output.subscribes[i]);
        }

        res.render('subadmin', {
            title: req.session.userid + ' 게시판 관리',
            sub: output,
            clean: clean,
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

module.exports = router;
