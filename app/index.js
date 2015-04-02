var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json({limit:'5mb'});
var urlencodedParser = bodyParser.urlencoded({limit:'5mb',extended:false});

app.use('/',express.static(__dirname + '/public'));


app.listen(7070,function(){
	console.log('server@7070');
});