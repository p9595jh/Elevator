var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sub = require('./sub.js');
var SubContent = require('./subcontents.js');

mongoose.connect('mongodb://localhost:27017/elevator');

router.get('/', function(req, res, next) {

    if ( !req.query.type || !req.session.userid ) {
        // only logged-in subscribed users can get in
        res.redirect('./start');
        return;
    }

    var User = require('./user.js');
    Sub.findOne({id: req.query.type}, function(err, sub) {
        var flag = false;
        for (var i=0; i<sub.subscribes.length; i++) {
            if ( sub.subscribes[i] == req.session.userid ) {
                flag = true;
                break;
            }
        }
        if ( !flag ) {
            res.redirect('./start');
            return;
        }
        var stopped = false;
        if ( req.session.userid ) {
            for (var i=0; i<sub.stops.length; i++) {
                if ( sub.stops[i] == req.session.userid ) {
                    stopped = true;
                    break;
                }
            }
        }

        SubContent.find({type: req.query.type}).sort({num:-1}).exec(function(err, subcontents) {
            res.render('subboard', {
                title: req.query.type + ' - 서브게시판',
                sub: sub,
                subcontents: subcontents,
                user: {
                    id: req.session.userid,
                    nickname: req.session.nickname,
                    stop: req.session.stop || stopped,
                    joindate: req.session.joindate,
                    boardRequest: req.session.boardRequest
                }
            });
        });
    });
});

router.get('/get-data', function(req, res, next) {
    SubContent.find({type: req.query.type}).sort({num:-1}).exec(function(err, subcontents) {
        res.send(subcontents);
    });
});

module.exports = router;
