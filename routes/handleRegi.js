var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('./user.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', function(req, res) {
    var user = new User();
    user.id = req.body.id;
    user.pw = req.body.password;
    user.email = req.body.email;
    user.nickname = req.body.nickname;
    user.genre = req.body.genre;
    var date = new Date();
    user.date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    user.introduction = req.body.intro;
    user.stop = false;

    user.save(function(err) {
        if ( err ) {
            res.status(500).send({ error: 'database failure' });
            return;
        }
        res.redirect('./start');
        // res.render('./start', {
        //     title: "Start",
        //     // user: {
        //     //     id: users.id,
        //     //     nickname: users.nickname
        //     // }
        //     user: users
        // });
    });
});

module.exports = router;
