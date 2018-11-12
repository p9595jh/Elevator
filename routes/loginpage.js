var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('loginpage', {
    title: '로그인',
    user: {
      id: req.session.userid,
      nickname: req.session.nickname
    }
  });
});

module.exports = router;
