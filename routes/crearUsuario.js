var express = require('express');
const  db  = require('./bbdd');
var router = express.Router();
const perm = require('../permissions')

router.post('/', function(req, res, next) {
    let valor=req.body["group1"]
    db.insertarUsu(req.body["usuario"],req.body["password"],valor,(err)=>{
        if(err){
            console.log("Error:",err)
            process.exit(1);
        }
            res.render('admin',{usu_hecho:"display"})
    })
        

});
  
  module.exports = router;
