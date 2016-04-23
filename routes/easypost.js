var express = require('express');
var router = express.Router();
var db = require('../db');

var uidToSocketMap = null;

/* Webhook endpoint for easypost. */
router.get('/', function(req, res, next) {
});

function update(og, update) {
    for (var attrname in update)
        og[attrname] = update[attrname];
}


router.post('/', function(req, res) {
    //update in req.body.result
    var updated = req.body.result;
    console.log(updated);
    db.TrackingModel.find({id: updated['id']}, function(err, doc) {
        console.log('got here');
        db.TrackingModel.findByIdAndUpdate(doc['_id'], {$set: updated}, function(err, doc) {
            //console.log('and here');
            //if (err) throw err;
            //uidToSocketMap.get(doc['uid']).emit('msg', doc['tracking_code'] + ' has been updated!');
        })
    });
    /*
    db.TrackingModel.findAndModify({ query: {tracking_code: updated['tracking_code']}}, {update: {status: "delivered"}}, function(err, doc) {
        console.log(doc);
        var sock = uidToSocketMap.get(req.body.uid);
        sock.emit('update');
        sock.emit('msg', updated['tracking_code'] + ' has been updated!');
    });
    */
    //next(); will give a 404
});


module.exports = {
    router: router,
    hashMap: uidToSocketMap
};