var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Notice = require('./noticeModel.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', function(req, res, next) {
    if ( req.session.userid != 'admin' ) {
        res.redirect('./notice');
        return;
    }

    var notice = new Notice();
    notice.id = req.session.userid;
    notice.nickname = req.session.nickname;
    notice.comment = req.body.comment;
    var date = new Date();
    notice.writedate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

    Notice.find().sort({num:-1}).exec(function(err, notices) {
        if ( err ) {
            console.log("Error in notice.js");
            res.status(500).send({ error: 'database failure' });
            return;
        }
        
        if ( notices.length == 0 ) notice.num = 0;
        else notice.num = notices[0].num + 1;
        notice.save(function(err) {
            if ( err ) {
                res.status(500).send({ error: 'database failure' });
                return;
            }
            res.redirect('./notice');
        });
    });
});

module.exports = router;
