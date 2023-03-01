var express = require('express');
const { db } = require('./bbdd');
var router = express.Router();
const perm = require('../permissions')

router.get('/', function(req, res, next) {
    if(req.session.usuario){  
        if(req.session.permission==perm.ADMIN){
            res.render('panel',{otro:"inline"})
        }
        else
        res.render('panel',{otro:"none"})
    
}else
    res.redirect('login')
    
});


module.exports = router;