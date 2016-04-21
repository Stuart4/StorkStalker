var express = require('express');
var router = express.Router();
var db = require('../db');

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
    console.log(updated['id']);
    db.TrackingModel.update({tracking_code: updated['tracking_code']}, {status: "delivered"}, {multi: true}, function(err) {
        console.log('updated the document');
    });
    //next(); will give a 404
});


module.exports = router;