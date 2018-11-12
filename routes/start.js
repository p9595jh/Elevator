var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('start', {
    title: 'Start',
    // loginDone: req.session.userid,
    // loginDone: false,
    // nickname: "NiCKTeST"
    // nickname: req.session.nickname

    user: {
      id: req.session.userid,
      nickname: req.session.nickname
    }
  });
});

module.exports = router;
