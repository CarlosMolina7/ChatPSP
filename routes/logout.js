// Se cierra la sesión del usuario

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    
        const token = req.cookies['toke']
        if (token){ 
            // Se comprueba que el token es válido
            res.cookie('toke',token,{maxAge:0})
        
        req.session.destroy()
        res.render('logout')
    }
    res.redirect("/login")
});

module.exports = router;
