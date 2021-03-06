var express = require('express');
var router = express.Router();
var db = require('../db');
var getSocketFromUid;
var connectSocketToUid;

/* GET user info. */
router.get('/', function(req, res, next) {
    console.log('user_info is getting got');

    db.UserModel.findById(req.query.uid, function (err, doc) {
        if (err || !doc) {
            res.send('fail');
        } else {
            res.json({first: doc.first, middle: doc.middle, last: doc.last, email: doc.email, password: doc.password, theme: doc.theme});
        }
    });
});

/* POST user info*/
router.post('/', function(req, res) {

    var uid = req.body.uid;
    var replacement;
    if (req.body.theme == undefined || req.body.theme == null || req.body.theme.length <= 0) {
        replacement = {
            first: req.body.first,
            middle: req.body.middle,
            last: req.body.last,
            email: req.body.email,
            password: req.body.password
        };
    } else {
        replacement = {
            theme: req.body.theme
        }
    }
    var conditions = {'_id': uid};
    db.UserModel.findOneAndUpdate(conditions, replacement, {upsert:true}, function(err, doc) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        var sock = getSocketFromUid(uid);
        sock.emit('update');
        return res.send("Update success");
    });
});

var setGetSocketFromUid = function(func) {
    getSocketFromUid = func;
};

var setConnectSocketToUid = function(func) {
    connectSocketToUid = func;
};
module.exports = {
    router: router,
    setGetSocketFromUid: setGetSocketFromUid,
    setConnectSocketToUid: setConnectSocketToUid
};
