var express = require('express');
var router = express.Router();
var User = require('./user.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res) {
    User.findOne({id: req.query.userid}, function(err, users) {
        if ( err ) {
            console.log("error!!!!");
            res.status(500).send({ error: 'database failure' });
            return;
        }
        res.render('info', {
            title: users.id,
            user: users
        });
    });
});

module.exports = router;
