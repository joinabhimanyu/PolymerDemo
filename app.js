var express = require('express');
var app = express();

app.use(express.static(__dirname));

var router = express.Router();

router.use(function(req, res, next) {
console.log(req.method, req.url);
next();
});

router.get('/index', function(req, res) {
res.sendfile('index.html');
});

app.use('/app', router);

app.listen(4000, function() {
console.log('server started');
});

