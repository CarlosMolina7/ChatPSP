var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  res.render('admin',{usu_hecho:"none"});
  console.lg(this is bad)
});
router.get('/', function(req, res, next) {
  res.render('admin',{usu_hecho:"none"});
});
module.exports = router;
