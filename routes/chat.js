var express = require('express');
var router = express.Router();
var app = express();
var expressWs = require('express-ws')(router);



router.get('/', function (req, res, next) {
  
    res.render('chat',{usuario:req.session.usuario});
  
});
/*
router.ws('/', function (ws, req) {
  console.log("hola")
  sockets.push(ws)
  total++
  ws.send(total)
  ws.on('message', (msg)=> {
    
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
*/
module.exports=router;