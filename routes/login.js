// Se solicita usuario y contraseña y se inicia la sesión
// asignando permisos al usuario.

var express = require('express');
var router = express.Router();
const db=require('./bbdd');
const md5=require('md5')
const hash = require('pbkdf2-password')()
const jwt = require('jsonwebtoken');
const data=require('../app')

router.get('/', function(req, res, next) {
    if(req.session.usuario) {
        console.log('Sesión iniciada')
        res.redirect('/login')
    }
    res.render('login', {login_error: "none"});
});

router.post('/', function(req, res, next) {
    const usuario = req.body['usuario']
    const password = req.body['password']
    const correo=req.body['correo']
    const pwdCorreo=req.body['pwdCorreo']
    if(req.session.usuario) {
        res.redirect('/inicio')
    }  
     db.loginUsu(usuario,password,(err,perm)=>{
        if(err){
            console.log("Error: " + err)
            res.render('login', {login_error: "inline"})
            next()
        }
        else{
        const token = jwt.sign({ usuario : usuario, password: password, correo:correo, pwdCorreo:pwdCorreo }, data.JWT_PASSWORD, {algorithm: 
            'HS256', expiresIn: 10 * 60 * 1000});
        res.cookie('toke', token)
        req.session.permission=perm
        req.session.usuario = usuario
        res.redirect("/panel")
        }
        })
        
});

module.exports = router;
