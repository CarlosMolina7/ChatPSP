var express = require('express');
const db = require('./bbdd');
var router = express.Router();
const data = require('../app')
const jwt = require('jsonwebtoken');

var nodemailer = require('nodemailer');

router.post('/', (req, res) => {
    console.log("hola")
    let passNueva = req.body["pass1"]
    let pass = req.body["password"]
    if (passNueva == pass) {
        db.actualizarUsu(req.session.usuario, req.body["password"], (err) => {
            if (err) {
                console.log("Error:", err)
                process.exit(1);
            }
            const token = req.cookies['toke']


            // Se comprueba que el token es válido
            const datos = jwt.verify(token, data.JWT_PASSWORD, { algorithm: 'HS256' })
            const usuario = datos.usuario
            const correo = datos.correo
            const pwdCorreo = datos.pwdCorreo
            const correoArray= correo.split('@')
            const correoMandar=correoArray[0]



            //Creamos el objeto de transporte
            var transporter = nodemailer.createTransport({
                host: 'smtp.educa.madrid.org', // DirecciÃ³n del servidor de correo de EducaMadrid
                port: '465', // Puerto en el que escucha el servidor SMTP
                auth: {
                    user: correoMandar,
                    pass: pwdCorreo
                }
            });

            var mensaje = "El usuario "+ usuario + " ha cambiado la contraseña";

            var mailOptions = {
                from: correoMandar+'@educa.madrid.org',
                to: 'cmolinaarcediano' + '@educa.madrid.org',
                subject: 'Cambio de contraseña',
                text: mensaje
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email enviado: ' + info.response);
                }
            });
            res.redirect('/panel')

        })
    } else {
        res.redirect('/panel')
    }

})

module.exports = router;
