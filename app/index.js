var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://146.203.54.165:27017/LINCS');
var Schema = mongoose.Schema({"assay":String,"assay-info":String},{collection:"milestones"})
var detail = mongoose.model('detail',Schema);

var jsonParser = bodyParser.json({limit:'5mb'});
var urlencodedParser = bodyParser.urlencoded({limit:'5mb',extended:false});

app.use('/milestonesViz',express.static(__dirname + '/public'));

app.get('/milestonesViz/meta',function(req,res){
	// console.log(typeof(req.query['ids']));
	var ids = JSON.parse(req.query['ids']);
	var query = detail.find({'lincs_id':{$in:ids}})
	.select('-_id assay assay-info center').lean().exec(function(err,docs){
		res.send(docs);
	})
})

var port = 7070;
app.listen(port,function(){
	console.log('server@'+port);
});
