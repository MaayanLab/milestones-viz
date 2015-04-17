define([],function(){
	function SearchBox(input,option,chart){
		
		// source series;
		var sourceSeries = option.series;
		// template clone of source series without data field;
		var templateSeries = JSON.parse(JSON.stringify(option.series));
		templateSeries.forEach(function(e){
			delete e.data;
		});

		var query = {};
		query.pert = {};
		query.pert.items = [];
		query.pert.idx = [];
		query.cell = {};
		query.cell.items = [];
		query.cell.idx = [];

		input.perts.forEach(function(e,i){
			e.idx = i+1;
		});

		input.cells.forEach(function(e,i){
			e.idx = i+1;
		});

		var perts = new Bloodhound({
       		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('pert'),
       		queryTokenizer: Bloodhound.tokenizers.whitespace,
       		limit:5,
       		local: input.perts
     	});

     	var cells = new Bloodhound({
       		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('cell'),
       		queryTokenizer: Bloodhound.tokenizers.whitespace,
       		limit:5,
       		local: input.cells
     	});

     	perts.initialize();
     	cells.initialize();

     	$('#search .typeahead').typeahead({
          hint: true,
          highlight: true,
          minLength: 1
        },
        {
          name: 'perturbagens',
          displayKey: 'pert',
          source: perts.ttAdapter(),
          templates: {
         		header: '<h3 class="league-name">Perturbagens</h3>'
       	  }
        },
        {
          name: 'cells',
          displayKey: 'cell',
          source: cells.ttAdapter(),
          templates: {
         		header: '<h3 class="league-name">Cells</h3>'
       	  }
        }
       ).on("typeahead:selected",function(event,item,datasetName){
       		var key, typeKey;
       		if(datasetName=="perturbagens"){
       			key = "pert";
       			typeKey = "pertClass";
       		}else if(datasetName=="cells"){
       			key = "cell";
       			typeKey	= "cellType";
       		}
       		if(!_.contains(query[key].idx,item.idx)){
       			query[key].items.push(item);
       			query[key].idx.push(item.idx);
       			$(herald).trigger('query:change',query);
       			refresh();
       		}
       });

       // connect to angular tagTable
       $(herald).bind('cellTags:change',function(e,idx){
       		// element in query.cell.items has already been removed because of pass by reference
       		query.cell.idx.splice(idx,1);
       		refresh();
       });
       $(herald).bind('pertTags:change',function(e,idx){
       		// element in query.cell.items has already been removed because of pass by reference
       		query.pert.idx.splice(idx,1);
       		refresh();
       });


       function refresh(){
       		// performance could be improved by building indices on series
       		var hasPerts = query.pert.idx.length;
       		var hasCells = query.cell.idx.length;
       		if(!hasCells&&!hasPerts){
       			option.series = sourceSeries;
       			chart.setOption(option,true);
       		}else{
       			var queriedSeries = JSON.parse(JSON.stringify(templateSeries));
       			sourceSeries.forEach(function(e,i){
       				queriedSeries[i].data = _.filter(e.data,function(each){
       					var pertMatch = false;
       					var cellMatch = false;
       					if(!hasPerts) pertMatch = true;
       					else pertMatch = _.contains(query.pert.idx,each[0]);
       					if(!hasCells) cellMatch = true;
       					else cellMatch = _.contains(query.cell.idx,each[1]);
       					return 	cellMatch && pertMatch
       				});
       			});
       			option.series = queriedSeries;
       			chart.setOption(option,true);
       		}
       }

	}

	return SearchBox;
});