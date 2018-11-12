var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('join', {
    title: '회원가입',
    user: {
      id: req.session.userid,
      nickname: req.session.nickname
    }
  });
});

module.exports = router;
