var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('./user.js');
var mongoose = require('mongoose');
var formidable = require('formidable');
var fs = require('fs-extra');

mongoose.connect('mongodb://localhost:27017/elevator');

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', function(req, res) {
    User.findOne({id: req.session.userid}, function(err, users) {
        if ( err ) {
            console.log("Error in handleRegi!!!!");
            res.status(500).send({ error: 'database failure' });
            return;
        }
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            var password = fields.password;
            var passwordNew = fields.passwordNew;
            var nickname = fields.nickname;
            var genre = fields.genre;
            var introduction = fields.intro;

            if ( password != users.pw ) {
                res.render('./fix', {
                    title: '회원정보수정',
                    errmsg: '기존 비밀번호가 일치하지 않습니다',
                    user: users
                });
            }
            else if ( passwordNew == '' || nickname == '' ) {
                res.render('./fix', {
                    title: '회원정보수정',
                    errmsg: '* 표시된 칸은 모두 채워야 합니다',
                    user: users
                });
            }
            else {
                // var filePath;
                // if ( files.image.name == '' ) {
                //     filePath = 'public/images/noimage.jpg';
                //     files.image.name = 'noimage.jpg';
                // }
                // else
                //     filePath = files.image.path;

                // var filePath = files.image.path;
                // var fileName = req.session.userid + files.image.name.substring(files.image.name.lastIndexOf('.'));

                // var localLocation = 'public/images/profileimages/';
                // var dbLocation = 'images/profileimages/' + fileName;
                // fs.copy(filePath, localLocation + fileName, function(err0) {
                //     if ( err0 ) console.err(err0);
                // });

                if ( files.image.name != '' ) {
                    var filePath = files.image.path;
                    fs.copy(filePath, 'public/images/profileimages/' + req.session.userid, function(err0) {
                        if ( err0 ) console.err(err0);
                    });
                }

                User.updateOne({id: req.session.userid}, {pw: passwordNew, nickname: nickname, genre: genre, introduction: introduction}, function(err1, output) {
                    if ( err1 ) {
                        res.status(500).json({err: 'database failure'});
                        return;
                    }
                    req.session.nickname = nickname;
                    res.render('./start', {
                        title: 'Start',
                        user: {
                            id: req.session.userid,
                            nickname: req.session.nickname,
                            stop: req.session.stop,
                            joindate: req.session.joindate
                        }
                    });
                });
            }
        });
    });
});

module.exports = router;
