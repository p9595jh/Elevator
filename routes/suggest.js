var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Suggest = require('./suggestModel.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {
    Suggest.find().sort({num:-1}).exec(function(err, suggests) {
        if ( err ) {
            console.log("Error in suggest.js");
            res.status(500).send({ error: 'database failure' });
            return;
        }
        res.render('suggest', {
            title: '건의사항',
            user: {
                id: req.session.userid,
                nickname: req.session.nickname
            },
            content: suggests
        })
    });
});

router.get('/get-data', function(req, res) {
    Suggest.find().sort({num:-1}).exec(function(err, suggests) {
        if (err) return res.status(500).send({error: 'database failure'});
        res.send(suggests);
    })
});

module.exports = router;
