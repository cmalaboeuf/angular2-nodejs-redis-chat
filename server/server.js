var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var server = require('http').createServer();

var winston = require('winston');
var redis = require('redis');


server.listen(8888);
server.on('connection',function(res){
  winston.info('Connection',this.arguments);
});
server.on('error',err => {
  winston.error(err);
});

server.on('listening',err => {
  winston.error(err);
})

var io = require('socket.io')(server);

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config/' + process.env.NODE_ENV + '.json');

app.use(cors());

app.use(bodyParser.json());

var store = redis.createClient(6379,'redis');
var pub = redis.createClient(6379,'redis');
var sub = redis.createClient(6379,'redis');

io.on('connection', function (client) {
  winston.info('Connection established');
  sub.subscribe('chatting');
  store.smembers('store_message', (err,replies)=>{
    winston.info('Try to read messages');
    if(!err){
      winston.info(replies);
      var arr = Object.keys(replies).map((key)=>{
        console.log("plop",key);
        return replies[key];
      });
      io.emit('message', arr);
    }
  });

  sub.on('message', function (channel, message) {
    winston.info('message received on server from publish ');
    client.send(message);
    // io.emit('message', {type:'new-message', text: message});
  });
  client.on('add-message', function (msg) {
    io.emit('message', {type:'new-message', text: msg});
    winston.info('On message socketio ',msg);
    pub.publish('chatting', msg);
    // if (msg.type == 'chat') {
    //   pub.publish('chatting', msg.message);
    // } else if (msg.type == 'setUsername') {
    //   pub.publish('chatting', 'A new user in connected:' + msg.user);
    store.sadd('store_message',  {type:'new-message', text: msg});
    // }
  });
  client.on('disconnect', function () {
    winston.info('On disconnect');
    sub.quit();
    pub.publish('chatting', 'User is disconnected :' + client.id);
  });
});

// var WebSocketServer = require('ws').Server;
// var wss = new WebSocketServer({noServer: true});

// var http = require('http');
// var server = http.createServer(function (request, response) {
//   response.writeHeader(200, { "Content-Type": "text/html" });
//   response.end();
// });

// server.listen(8888);
// server.on('upgrade',(req,socket)=> {
//   let res = new http.ServerResponse(req)
//   res.assignSocket(socket)
// });
// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });

//   ws.send('something');
// });
