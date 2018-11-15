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
        // console.log(req.body);
        // console.log(users);
        var form = new formidable.IncomingForm();
        // var password = '';
        // var passwordNew = '';
        // var nickname = '';
        // var genre = '';
        // var introduction = '';

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
                // var dbLocation = '';
                var filePath = files.image.path;
                var fileName = req.session.userid + files.image.name.substring(files.image.name.lastIndexOf('.'));
                var localLocation = 'public/images/profileimages/';
                var dbLocation = 'images/profileimages/' + fileName;
                fs.copy(filePath, localLocation + fileName, function(err0) {
                    if ( err0 ) console.err(err0);
                });

                // form.on('end', function(fields, files) {
                //     var tempPath = '';
                //     var fileName = '';
                //     var localLocation = '';
                //     var dbLocation = '';
                //     for (var i=0; i<this.openedFiles.length; i++) {
                //         console.log(req.session);
                //         console.log(this.openedFiles[i]);
                //         tempPath = this.openedFiles[i].path;
                //         fileName = req.session.userid + this.openedFiles[i].name.lastIndexOf('.');
                //         localLocation = 'public/images/profileimages/';
                //         dbLocation = 'images/profileimages/' + fileName;
                //         fs.copy(tempPath, localLocation + fileName, function(errO) {
                //             if ( err0 ) console.err(err0);
                //             else console.log("worked");
                //         });
                //     }

                    // User.updateOne({id: req.session.userid}, {pw: passwordNew, nickname: nickname, genre: genre, introduction: introduction, image: dbLocation}, function(err1, output) {
                    //     if ( err1 ) {
                    //         res.status(500).json({err: 'database failure'});
                    //         return;
                    //     }
                    //     req.session.nickname = nickname;
                    //     res.render('./start', {
                    //         title: 'Start',
                    //         user: {
                    //             id: req.session.userid,
                    //             nickname: req.session.nickname,
                    //             stop: req.session.stop,
                    //             joindate: req.session.joindate
                    //         }
                    //     });
                    // });
                // });

                User.updateOne({id: req.session.userid}, {pw: passwordNew, nickname: nickname, genre: genre, introduction: introduction, image: dbLocation}, function(err1, output) {
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
                
                // User.updateOne({id: req.session.userid}, {pw: passwordNew, nickname: nickname, genre: genre, introduction: introduction, image: dbLocation}, function(err, output) {
                //     if ( err ) {
                //         res.status(500).json({err: 'database failure'});
                //         return;
                //     }
                //     req.session.nickname = nickname;
                //     res.render('./start', {
                //         title: 'Start',
                //         user: {
                //             id: req.session.userid,
                //             nickname: req.session.nickname,
                //             stop: req.session.stop,
                //             joindate: req.session.joindate
                //         }
                //     });
                // });
            }
        });

        // res.render('./fix', {
        //     title: '회원정보수정',
        //     errmsg: '알 수 없는 에러',
        //     user: users
        // });

        // if ( password != users.pw ) {
        //     res.render('./fix', {
        //         title: '회원정보수정',
        //         errmsg: '기존 비밀번호가 일치하지 않습니다',
        //         user: users
        //     });
        // }
        // else if ( passwordNew == '' || nickname == '' ) {
        //     res.render('./fix', {
        //         title: '회원정보수정',
        //         errmsg: '* 표시된 칸은 모두 채워야 합니다',
        //         user: users
        //     });
        // }
        // else {
        //     var dbLocation = '';
        //     form.on('end', function(fields, files) {
        //         for (var i=0; i<this.openedFiles.length; i++) {
        //             var tempPath = this.openedFiles[i].path;
        //             var fileName = req.session.userid + this.openedFiles[i].name.lastIndexOf('.');
        //             var localLocation = 'public/images/profileimages/';
        //             dbLocation = 'images/profileimages/' + fileName;
        //             fs.copy(tempPath, localLocation + fileName, function(errO) {
        //                 if ( err ) console.err(err);
        //             });
        //         }
        //     });

        //     User.update({id: req.session.userid}, {pw: passwordNew, nickname: nickname, genre: genre, introduction: introduction, image: dbLocation}, function(err, output) {
        //         if ( err ) {
        //             res.status(500).json({err: 'database failure'});
        //             return;
        //         }
        //         req.session.nickname = nickname;
        //         res.render('./start', {
        //             title: 'Start',
        //             user: {
        //                 id: req.session.userid,
        //                 nickname: req.session.nickname,
        //                 stop: req.session.stop,
        //                 joindate: req.session.joindate
        //             }
        //         });
        //     });
        // }
    });
});

module.exports = router;
