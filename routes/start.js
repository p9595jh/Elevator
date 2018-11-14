var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('start', {
    title: 'Start',
    user: {
      id: req.session.userid,
      nickname: req.session.nickname,
      stop: req.session.stop,
      joindate: req.session.joindate
    }
  });
});

module.exports = router;
