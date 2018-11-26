var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', function(req, res, next) {
    res.render('write', {
        title: '글 작성',
        user: {
            id: req.session.userid,
            nickname: req.session.nickname,
            stop: req.session.stop,
            joindate: req.session.joindate,
            boardRequest: req.session.boardRequest
        },
        type: req.body.type
    });
});

module.exports = router;
