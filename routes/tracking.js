var express = require('express');
var router = express.Router();
var easypost = require('node-easypost')(process.env.easypost_apikey_production);
var db = require('../db');

var getSocketFromUid;
var connectSocketToUid;


/* POST new tracking with uid and tracking_code. */
router.post('/', function(req, res) {
    easypost.Tracker.create({ 'tracking_code': req.body.tracking_code}, function(err,res) {
        res['uid'] = req.body.uid;
        res['description'] = req.body.description;
        var child = new db.TrackingModel(res);

        child.save(function (err) {
            if (err) throw err;
            var sock = getSocketFromUid(req.body.uid);
            sock.emit('update');
        });

    });
    res.send('success');
    });

router.get('/', function(req, res) {
    db.TrackingModel.find({uid: req.query.uid}, function(err, packages) {
        res.send(packages);
    })
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