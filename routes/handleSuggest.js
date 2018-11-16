var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Suggest = require('./suggestModel.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', function(req, res, next) {
    var suggest = new Suggest();
    suggest.id = req.session.userid;
    suggest.nickname = req.session.nickname;
    suggest.comment = req.body.comment;
    var date = new Date();
    suggest.writedate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

    Suggest.find().sort({num:-1}).exec(function(err, suggests) {
        if ( err ) {
            console.log("Error in suggest.js");
            res.status(500).send({ error: 'database failure' });
            return;
        }
        
        if ( suggests.length == 0 ) suggest.num = 0;
        else suggest.num = suggests[0].num + 1;
        suggest.save(function(err) {
            if ( err ) {
                res.status(500).send({ error: 'database failure' });
                return;
            }
            res.redirect('./suggest');
        });
    });
});

module.exports = router;
