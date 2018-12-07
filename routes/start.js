var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Freeboard = require('./freeboard.js');
var MusicClass = require('./musicclass.js');
var SuggestModel = require('./suggestModel.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
  
  Freeboard.find().sort({num:-1}).limit(5).exec(function(err1, frees) {
    MusicClass.find().sort({num:-1}).limit(5).exec(function(err2, musics) {
      SuggestModel.find().sort({num:-1}).limit(5).exec(function(err3, suggests) {
        for (var i=0; i<suggests.length; i++) {
          if ( suggests[i].comment.length > 10 ) {
            var s = suggests[i].comment.substring(0, 8);
            s += "...";
            suggests[i].comment = s;
          }
        }

        res.render('start', {
          title: 'Elevator',
          user: {
            id: req.session.userid,
            nickname: req.session.nickname,
            stop: req.session.stop,
            joindate: req.session.joindate,
            boardRequest: req.session.boardRequest
          },
          free: frees,
          music: musics,
          suggest: suggests
        });
      });
    });
  });
});

module.exports = router;
