var express = require('express');
var router = express.Router();
var db = require('../db');
var hashmap = require('hashmap');

var uidToSocketMap = new hashmap.HashMap();

/* GET user info. */
router.get('/', function(req, res, next) {
    console.log('user_info is getting got');

    db.UserModel.findById(req.query.uid, function (err, doc) {
        if (err || !doc) {
            res.send('fail');
        } else {
            res.json({first: doc.first, last: doc.last, email: doc.email});
        }
    });
});

/* POST user info*/
router.post('/', function(req, res) {

    var uid = req.body.uid;
    console.log(uid);
    var first = req.body.first;
    var conditions = {'_id': uid};
    db.UserModel.findOneAndUpdate(conditions, {first: req.body.first}, {upsert:true}, function(err, doc) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send("Update success");
    });
});
module.exports = router;
