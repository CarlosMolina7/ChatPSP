var express = require('express');
var router = express.Router();
const db=require('./bbdd');

router.get('/', function(req, res, next) {
  db.crearBBDD();
  res.redirect('/')
});

module.exports = router;
