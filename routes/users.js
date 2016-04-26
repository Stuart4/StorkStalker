var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (!req.query.password || !req.query.email) {
    res.send('fail');
    return;
  }
  db.UserModel.findOne({password: req.query.password, email: req.query.email}, function (err, doc) {
    if ( err || !doc) {
      res.send('fail');
    } else {
      res.send(doc.id);
    }
  });
});

/* Post to users. */
router.post('/', function(req, res) {
  req.body.theme = 'blueTheme';
  req.body.middle = ' ';
  var child = new db.UserModel(req.body);
  child.save(function (err) {
    if (err) {
      res.send('fail');
    } else {
      res.send(child.id);
    }
  });
});

module.exports = router;
