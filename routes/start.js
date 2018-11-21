var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Freeboard = require('./freeboard.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
  // var free;
  // Freeboard.find().sort({num:-1}).exec(function(err, frees) {
  //   free = frees;
  // });
  // console.log(free);


  res.render('start', {
    title: 'Start',
    user: {
      id: req.session.userid,
      nickname: req.session.nickname,
      stop: req.session.stop,
      joindate: req.session.joindate
    },
    // free: free
  });
});

module.exports = router;
