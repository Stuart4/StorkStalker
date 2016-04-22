var express = require('express');
var router = express.Router();
var db = require('../db');

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


module.exports = router;
