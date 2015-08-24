var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var jsonParser = bodyParser.json({limit:'5mb'});
var urlencodedParser = bodyParser.urlencoded({limit:'5mb',extended:false});

app.use('/milestonesViz',express.static(__dirname + '/public'));


var port = 7070;
app.listen(port,function(){
	console.log('server@'+port);
});
