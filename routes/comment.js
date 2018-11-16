var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
// var FreeBoard = require('./freeboard.js');
var Board;
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', function(req, res) {
    console.log(req.body);
    if ( req.body.board == 'free' ) {
        Board = require('./freeboard.js');
        Board.findOne({_id: req.body._id}, function(err, frees) {
            if ( err ) {
                console.log("Error in handling comment");
                res.status(500).send({ error: 'database failure' });
                return;
            }

            var num = 0;
            if ( frees.comment.length > 0 ) {
                for (var i=0; i<frees.comment.length; i++) {
                    if ( num < frees.comment.num )
                        num = frees.comment.num;
                }
                num++;
            }
            var id = req.session.userid;
            var nickname = req.session.nickname;
            var date = new Date();
            var writedate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
            var comment = req.body.comment;
            var data = {num: num, id: id, nickname: nickname, writedate: writedate, comment: comment};
            Board.updateOne({_id: req.body._id}, {$push: {comment: data}}, function(err1, output) {
                if ( err1 ) {
                    res.status(500).json({err: 'database failure'});
                    return;
                }
                res.redirect('./content?type=' + req.body.board + '&num=' + frees.num);
            });
        });
    }
});

module.exports = router;
