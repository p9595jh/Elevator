var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var FreeBoard = require('./freeboard.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', function(req, res) {
    FreeBoard.find({}).sort({num:-1}).exec(function(err, frees) {
        if ( err ) {
            console.log("Error in handleWrite!!!!");
            res.status(500).send({ error: 'database failure' });
            return;
        }

        var free = new FreeBoard();
        free.id = req.session.id;
        free.nickname = req.session.nickname;
        free.title = req.body.title;
        free.content = req.body.content;
        free.tag = req.body.tag;
        if ( free.title == '' ) free.title = '#';
        if ( free.content == '' ) free.content = '#';
        
        var date = new Date();
        free.writedate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        free.hit = 0;
        free.recommend = 0;
        free.num = frees[0].num + 1;

        free.save(function(err) {
            if ( err ) {
                res.status(500).send({ error: 'database failure' });
                return;
            }
            res.redirect('./free');
        });
    });
});

module.exports = router;
