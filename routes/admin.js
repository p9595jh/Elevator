var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./user.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
    if ( req.session.userid != 'admin' ) {
        console.log("invalid access");
        return;
    }

    User.find(function(err, users) {
        res.render('admin', {
            title: '어드민',
            users: users,
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
