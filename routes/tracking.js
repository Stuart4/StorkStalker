var express = require('express');
var router = express.Router();
var easypost = require('node-easypost')(process.env.easypost_apikey_testing);
var db = require('../db');
var hashmap = require('hashmap');

var uidToSocketMap = new hashmap.HashMap();


/* POST new tracking with uid and tracking_code. */
router.post('/', function(req, res) {
    easypost.Tracker.create({ 'tracking_code': req.body.tracking_code}, function(err,res) {
        res['uid'] = req.body.uid;
        res['description'] = req.body.description;
        var child = new db.TrackingModel(res);

        child.save(function (err) {
            if (err) throw err;
            var sock = uidToSocketMap.get(req.body.uid);
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

var connectSocketToUid = function (socket, uid) {
    uidToSocketMap.set(uid, socket);
};


module.exports = {
    router: router,
    connectSocketToUid: connectSocketToUid,
    hashmap: uidToSocketMap
};