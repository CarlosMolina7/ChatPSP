var createError = require('http-errors');
const perm = require('./permissions')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
const md5 = require('md5')
const JWT_PASSWORD = 'ContraseñaMolina'
const jwt = require('jsonwebtoken');

// Se cargan las rutas

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var inicioRouter = require('./routes/inicio');
var logoutRouter = require('./routes/logout');
var adminRouter = require('./routes/admin');
var instalarRouter = require('./routes/instalar')
var panelRouter = require("./routes/panel")
var cambiarRouter = require("./routes/cambiar")
var crearUsuarioRouter = require("./routes/crearUsuario")
var cambiarUsuarioRouter = require("./routes/cambiarUsuario")
var borrarUsuarioRouter = require("./routes/borrarUsuario")
var chatRouter = require("./routes/chat")

var app = express();
var expressWs = require('express-ws')(app);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: "Contraseña",
        cookie: { maxAge: 10 * 60 * 1000 },
        saveUninitialized: false,
        resave: false
    })
)

// Listado de las páginas que se pueden ver sin autentificación
const public_pages = [
    "/",
    "/login",
    "/instalar",
    
];



// Listado de páginas que requieren algún tipo de autorización especial
const private_pages = {
    "/inicio": [perm.ADMIN, perm.USER],
    "/logout": [perm.ADMIN, perm.USER],
    "/admin": [perm.ADMIN],
    "/cambiar": [perm.ADMIN, perm.USER],
    "/panel": [perm.ADMIN, perm.USER],
    "/crearUsuario": [perm.ADMIN],
    "/cambiarUsuario": [perm.ADMIN],
    "/borrarUsuario": [perm.ADMIN],
    "/chat":[perm.ADMIN,perm.USER],
    "/chat/.websocket":[perm.ADMIN,perm.USER]
};

// Control de sesión iniciada
app.use((req, res, next) => {
    if (req.cookies) {
        // Si hay cookies, se verifica que hay un token:
        const token = req.cookies['toke']
        if (token) {
            // Se comprueba que el token es válido
            const datos = jwt.verify(token, JWT_PASSWORD, { algorithm: 'HS256' })
            if (datos.usuario == req.session.usuario) {
                // Sesión iniciada
                if (public_pages.includes(req.url) || (private_pages[req.url] && private_pages[req.url].includes(req.session.permission)))
                    next()
                else
                    next(createError(403))
            }
        } else {
            // Si el usuario no ha iniciado sesión, se verifica que la página es pública
            if (public_pages.includes(req.url))
                next()
            else if (private_pages[req.url])
                res.redirect('/login')
            else
                next(createError(404)) // Not found
        }
    }
    // Se verifica que el usuario haya iniciado sesión

})

const sockets = []
const mensajes = []
app.ws('/chat', function (ws, req) {
    sockets.push(ws)
    
    console.log("hola")

    ws.on('message', function (msg) {
        console.log(msg);
        const json = JSON.parse(msg)
        console.log(json.usuario, json.mensaje)
        mensajes.push(json)
        for (let n = 0; n < sockets.length; n++)
            sockets[n].send(JSON.stringify(mensajes))
        
    });
    ws.on('close', () => {
        console.log('Socket cerrado')
        for (let n = 0; n < sockets.length; n++) {
            if (sockets[n] == ws) {
                console.log('Borrando el socket de la lista')
                sockets.splice(n, 1)
            }
        }
    })
});

// Se asignan las rutas a sus funciones middleware

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/inicio', inicioRouter);
app.use('/logout', logoutRouter);
app.use('/admin', adminRouter)
app.use('/instalar', instalarRouter);
app.use('/panel', panelRouter);
app.use('/crearUsuario', crearUsuarioRouter)
app.use('/cambiarUsuario', cambiarUsuarioRouter)
app.use('/borrarUsuario', borrarUsuarioRouter)
app.use('/cambiar', cambiarRouter)
app.use('/chat', chatRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
exports.JWT_PASSWORD = JWT_PASSWORD;
app.listen(8080)