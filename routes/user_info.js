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
            res.json({first: doc.first, last: doc.last, email: doc.email, theme: doc.theme});
        }
    });
});

/* POST user info*/
router.post('/', function(req, res) {

    var uid = req.body.uid;
    var replacement = {first: req.body.first,
        last: req.body.last,
        theme: req.body.theme
    };
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
