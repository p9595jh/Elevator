var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('find', {
    title: '계정분실',
    user: {
      id: req.session.userid,
      nickname: req.session.nickname,
      stop: req.session.stop,
      joindate: req.session.joindate,
      boardRequest: req.session.boardRequest
    }
  });
});

module.exports = router;
