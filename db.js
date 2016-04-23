/**
 * Created by jake on 4/20/16.
 */
var mongoose = require('mongoose');
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
    uid: String,
    description: String
});
var TrackingModel = mongoose.model('TrackingModel', trackingSchema);

var userSchema = mongoose.Schema({
    first: String,
    last: String,
    email: {type: String, unique: true},
    password: String
});
var UserModel = mongoose.model('UserModel', userSchema);

module.exports = {
    TrackingModel: TrackingModel,
    UserModel: UserModel
};