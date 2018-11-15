var express = require('express');
var router = express.Router();
var User = require('./user.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
    User.findOne({id: req.session.userid}, function(err, users) {
        if ( err ) {
            console.log("error!!!!");
            res.status(500).send({ error: 'database failure' });
            return;
        }

        res.render('./fix', {
            title: "회원정보수정",
            user: users,
            errmsg: ''
        });
    });
});

module.exports = router;
