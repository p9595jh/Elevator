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
        if ( users == null ) {
            console.log("Failed to login (null)");
            res.redirect('./loginpage');
        }
        else if ( users.length === 0 ) {
            console.log("Failed to login (length == 0)");
            res.redirect('./loginpage');
        }
        else {
            req.session.userid = users.id;
            req.session.nickname = users.nickname;
            req.session.stop = users.stop;
            req.session.joindate = users.joindate;
            req.session.boardRequest = users.boardRequest;
            res.render('./start', {
                title: "Start",
                user: users
            });
        }
    });
});
router.post('/checklogin', function(req, res) {
    User.findOne({id: req.body.id, pw: req.body.pw}, function(err, users) {
        if (err) {
            res.json({id: ""});
            return;
        }
        res.send(users);
    });
});

module.exports = router;
