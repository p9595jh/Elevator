var express = require('express');
var router = express.Router();
var Playlist = require('./playlist.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res) {
    Playlist.findOne({id: req.query.userid}, function(err, output) {
        if ( err ) {
            console.log("error!!!!");
            res.status(500).send({ error: 'database failure' });
            return;
        }
        res.render('openplaylist', {
            title: req.query.userid,
            playlist: output
        });
    });
});

module.exports = router;
