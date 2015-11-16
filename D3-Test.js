
window.onload = function(){
	var winWidth = window.innerWidth - 100;
	var winHeight = window.innerHeight - 100;
	var SIZE = 5;
	var TOPMARGIN = 1;
	var STATE = 0;
	var TRANSITIONSPEED = 1000;
	var data = [10, 20, 50, 150,20,20];
	var data2 = [636, 623,615,672,601,600,542,554,543,520,609,559,595,565,573,554,626,501,574,468,578,560,525,647,456,688,679,960,558,482,527,536,557,572,457,489,532,506,648,485,610,444,626,626,426,585,487,436,642,476,586,565,617,528,578,472,485,539,523,479,535,603,512,449];
	var data3 = [];
	for(var o = 0; o < 100; o++){
		var randNum = Math.ceil(Math.random()*100);
		data3.push(randNum);
	}
	data = data3;
	var hMap = {}
	var svg = d3.select(".svg");
	svg.attr("width", winWidth);
	svg.attr("height", winHeight);
	svg.style("margin-left", "10px");

	var x = d3.scale.linear().range([SIZE + TOPMARGIN,winWidth - SIZE - TOPMARGIN - 10]);
	x.domain([d3.min(data), d3.max(data)]);

	var xAxis = d3.svg.axis();
	xAxis.scale(x)

	var circle = svg.selectAll("circle")
	    .data(data);
	   circle.enter().append("circle")
	    .attr("cx", function(d, i) { 

	    	return x(d); })
	    .attr("cy", function(d) {
	    	if(!(d in hMap)){
	    		hMap[d] = 0;
	    	}else{
	    		hMap[d] = hMap[d] += SIZE*2 + TOPMARGIN*2;
	    	}
	    	return winHeight/3 - hMap[d];
	    })
	    .attr("r", function(d) { return SIZE; })
	    .attr("opacity", 1)
	    .attr("stroke","#556270")
	    .attr("stroke-opacity",1);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (winHeight/3 + 20) + ")").call(xAxis);

	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (winHeight/3 * 2 + 20) + ")").call(xAxis);

	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (winHeight/3 * 2.5 + 20) + ")").call(xAxis);
	var popMean = findMean(data);
	svg.append("line").attr("x1", x(popMean)).attr("y1", winHeight/3 + 20).attr("x2", x(popMean)).attr("y2", winHeight/3 - 20).style("stroke-width", 2).style("stroke", "black");
	var sampleMeans = [];
	var sample = [];
	var hMap2 = {};
	var placements = {};
	
	document.onkeypress = function(e){
		e =e || window.event;

		if(e.keyCode == 115 && STATE == 0){
			sample = pickRand(20, data.length);
			hMap2 = {};
			placements = {};
			var found = false;
			circle.filter(function(d,i){
				return sample.indexOf(i) >= 0;
			})
			.transition().duration(TRANSITIONSPEED)
		    .attr("cy", function(d, i){
		    		placements[i] = d3.select(this).attr("cy");
		    		if(!(d in hMap2)){
			    		hMap2[d] = 0;
			    	}else{
			    		hMap2[d] = hMap2[d] += 11;
			    	}
			    	return winHeight/3*2 - hMap2[d];

		    }).each('start', function(d){d3.select(this).style("fill", "#FF7148")});
			var sampMean = findMean(sample);
			sampleMeans.push(sampMean);
			var meanLines = svg.select(".sampleLines").selectAll("line").data(sampleMeans);
			meanLines.enter().append("line").attr("x1", function(d){return x(d)}).attr("y1", winHeight/3 + 20).attr("x2", function(d){return x(d)}).attr("y2", winHeight/3 - 20).style("stroke-width", 2).style("stroke", "green").style("opacity", 0)
					.transition().duration(TRANSITIONSPEED).attr("y1", winHeight/3 * 2 + 20).attr("y2", winHeight/3 * 2 - 20).style("opacity", 1);
			STATE = -1;
			setTimeout(function(){
				STATE = 1;
			}, TRANSITIONSPEED*0.9);

		}
		if(e.keyCode == 115 && STATE == 1){
			var meanOfSamples  = findMean(sampleMeans);
			svg.select(".meanOfSamples").append("line").attr("x1", x(meanOfSamples)).attr("y1", winHeight/3 * 2 + 30).attr("x2", x(meanOfSamples)).attr("y2", winHeight/3 * 2 - 30).style("stroke-width", 2).style("stroke", "#EC583A").style("opacity", 0)
				.transition().duration(TRANSITIONSPEED).attr("y1", winHeight/3 * 2.5 + 20).attr("y2", winHeight/3 * 2.5 - 20).style("opacity", 1);
		}

		if(e.keyCode == 119 && STATE == 1){
			hMap = {}
			circle.filter(function(d,i){
				return sample.indexOf(i) >= 0;
			})
			.transition().duration(TRANSITIONSPEED)
			    .attr("cy", function(d, i) {
			    	return placements[i];
			    })
			    .style("fill","#C7D0D5");
			var meanLines = svg.select(".sampleLines").selectAll("line").data(sampleMeans);
			meanLines.transition().duration(TRANSITIONSPEED).attr("y2", winHeight/3 * 2 - 10).attr("y1", winHeight/3 * 2 + 10).style("stroke", "steelblue");
			
			hMap2 = {};
			STATE = -1;
			setTimeout(function(){
				STATE = 0;
			}, TRANSITIONSPEED*0.9);
			
		}
		
	}
}

function pickRand(numToPick, numFrom){
	var indexs = [];
	while(indexs.length < numToPick){
		var randomNumber = Math.ceil(Math.random()*numFrom) - 1;
		var found = false;
		for(var i =0;i<indexs.length;i++){
			if(indexs[i] == randomNumber){
				found = true;
				break;
			}
		}
		if(!found){
			indexs.push(randomNumber);
		}
	}
	return indexs;
}

function findMean(numbers){
	var total = 0;
	for(var i = 0;i<numbers.length;i++){
		total += numbers[i];
	}
	return total/numbers.length;
}
