var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('success');
  console.log(req.body);
  db.UserModel.findOne({password: req.body.password, email: req.body.email}, function (err, doc) {
    if (err) throw err;
    res.send(doc['id']);
  });
});

/* Post to users. */
router.post('/', function(req, res) {
  res.send('success');
  console.log(req.body);
  var child = new db.UserModel(req.body);
  child.save();
});

module.exports = router;
