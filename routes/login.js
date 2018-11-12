var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('./user.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', function(req, res) {
    User.findOne({id: req.body.id, pw: req.body.password}, function(err, users) {
        if ( err ) {
            console.log("error!!!!");
            res.status(500).send({ error: 'database failure' });
            return;
        }
        if ( users.length === 0 ) {
            console.log("no result!!!!");
            req.session.loginDone = false;
            res.redirect('./start');
        }
        else {
            console.log("yes result!!!!");
            console.log(users);
            console.log(users._id);

            req.session.userid = users.id;
            req.session.nickname = users.nickname;
            res.render('./start', {
                title: "Start",
                // user: {
                //     id: users.id,
                //     nickname: users.nickname
                // }
                user: users
            });
            // res.redirect('./start');
        }
    });
});

module.exports = router;
