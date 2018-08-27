const http = require('http');
const director = require('director');
const bot = require('./bot.js');


router = new director.http.Router({
  '/' : {
    post: bot.respondFirst,
    get: ping
  }
});

console.log("Creating Server");
server = http.createServer(function(req, res) {
  req.chunks = [];
  req.on('data', function(chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});


port = Number(process.env.PORT || 5000);
console.log(`Setting up server on port ${port}`);
server.listen(port);

function ping() {
  this.res.writeHead(200);
  this.res.end("Hello!");
}
