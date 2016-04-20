var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var easypost = require('node-easypost')(process.env.easypost_apikey_production);
mongoose.connect(process.env.mlabs_uri_production);

//mongoose's models and schemas
var trackingLocationSchema = mongoose.Schema({
    city: String,
    state: String,
    country: String,
    zip: String
});
var trackingDetailsSchema = mongoose.Schema({
    message: String,
    status: String,
    datetime: String,
    source: String,
    tracking_location: trackingLocationSchema
});
var trackingSchema = mongoose.Schema({
    cls: String,
    apiKey: String,
    id: String,
    object: String,
    mode: String,
    tracking_code: String,
    status: String,
    created_at: String,
    updated_at: String,
    signed_by: String,
    weight: Number,
    est_delivery_date: String,
    shipment_id: String,
    carrier: String,
    tracking_details: [trackingDetailsSchema],
    uid: Number
});
var TrackingModel = mongoose.model('TrackingModel', trackingSchema);


/* POST new tracking with uid and tracking_code. */
router.post('/', function(req, res) {
    easypost.Tracker.create({ 'tracking_code': req.body.tracking_code}, function(err,res) {
        res['uid'] = req.body.uid;
        var child = new TrackingModel(res);

        child.save(function (err) {
            if (err) throw err;
            console.log('added a new document to the mongo')
        });

    });
    res.send('success');
    });

router.get('/', function(req, res) {
    TrackingModel.find({uid: req.query.uid}, function(err, packages) {
        res.send(packages);
    })
});


module.exports = router;