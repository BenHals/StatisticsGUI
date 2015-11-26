


function oneMean(inputData, heading, statistic){
	this.xScale = null;
	this.windowHelper = null;
	this.radius = 5;
	this.population = [];
	this.populationStatistic = null;
	this.samples = null;
	this.preCalculatedTStat = [];
	this.transitionSpeed = 1000;
	this.index = 0;
	this.statsDone = false;
	this.animationState = 0;
	this.baseTransitionSpeed = 1000;
	this.inputData = inputData;
	this.heading = heading;
	this.statistic = statistic;


this.setUpPopulation = function(){
	this.windowHelper = setUpWindow(this.radius);
	this.population = [];
	var max = null;
	var min = null;
	for(var i = 0; i<this.inputData.length;i++){
		var value = +this.inputData[i][this.heading];
		if(max == null | value > max) max = value;
		if(min == null | value < min) min = value;
		this.population.push(new item(value, i));
	}

	this.xScale = d3.scale.linear().range([this.radius,this.windowHelper.innerWidth]);
	this.xScale.domain([min,max]);


	this.populationStatistic = 0;
	this.populationStatistic = getStatistic(this.statistic, this.population);
	heapYValues3(this.population, this.xScale, this.radius, 0, this.windowHelper.section1.top, this.windowHelper.section1.bottom);
}
this.setUpSamples = function(){
	this.samples = makeSamples(this.population, numSamples, 20);
	for(var k = 0; k < numSamples;k++){
		var stat = getStatistic(this.statistic, this.samples[k])
		heapYValues3(this.samples[k], this.xScale,this.radius, k+1, this.windowHelper.section2.top, this.windowHelper.section2.bottom);
		this.preCalculatedTStat.push(new item(stat, k));
	}
	heapYValues3(this.preCalculatedTStat, this.xScale, this.radius, 0, this.windowHelper.section3.top,this.windowHelper.section3.bottom);

	this.statsDone = true;

}
this.makeSamples = function(population, numSamples, sampleSize){
var samples = [];
for(var i = 0; i<numSamples;i++){
	samples.push([]);
	var indexs = pickRand(sampleSize, population.length);
	for(var k = 0; k<sampleSize;k++){
		samples[i].push(population[indexs[k]]);
	}
}
return samples;
}


this.draw = function(){
	var self = this;
	if(!this.statsDone) return;
	var TRANSITIONSPEED = this.transitionSpeed;
	var sampleMeans = [];
	var svg = d3.select(".svg");
	var xAxis = d3.svg.axis();
	xAxis.scale(this.xScale)
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section1.bottom + this.radius) + ")").call(xAxis);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section2.bottom + this.radius) + ")").call(xAxis);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section3.bottom + this.radius) + ")").call(xAxis);
	var circle = svg.selectAll("circle").data(this.population);
	   circle.enter().append("circle")
	    .attr("cx", function(d, i) { 
	    	return d.xPerSample[0]; })
	    .attr("cy", function(d) {
	    	return d.yPerSample[0];
	    })
	    .attr("r", function(d) { return self.radius; })
	    .attr("fill-opacity", 0.5)
	    .attr("stroke","#556270")
	    .attr("stroke-opacity",1);

	svg.append("line").attr("x1", this.xScale(this.populationStatistic)).attr("y1", this.windowHelper.section1.bottom+20).attr("x2", this.xScale(this.populationStatistic)).attr("y2", this.windowHelper.section1.bottom-20).style("stroke-width", 2).style("stroke", "black");

	var meanLines = svg.select(".sampleLines").selectAll("line").data(this.preCalculatedTStat)
		.enter().append("line").attr("y1", this.windowHelper.section1.bottom+20).attr("y2", this.windowHelper.section1.bottom-20).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);

	var meanCircles = svg.select(".meanOfSamples").selectAll("circle").data(this.preCalculatedTStat)
		.enter().append("circle")
		    .attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0] - (self.windowHelper.section3.bottom- self.windowHelper.section2.bottom);
		    })
		    .attr("r", function(d) { return self.radius; })
		    .attr("fill-opacity", 0)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",0);
}
this.startAnim = function(repititions, goSlow){
	if(repititions >999) this.resetLines();
	if(this.animationState == 0){
		this.transitionSpeed = this.baseTransitionSpeed-repititions*20;
		this.animationState = 1;
		if(this.index > numSamples){
			this.index = this.index % numSamples;
			resetLines();
		}
		var start = this.index;
		var end = start + repititions;
		if(repititions > 100) this.transitionSpeed = 0;
		var jumps = 1;
		if(repititions > 20) jumps = 10;
		this.down(start, end, goSlow, jumps);
	}
}
this.down = function(indexUpTo, goUpTo, goSlow, jumps){
	var self = this;
	var svg = d3.select(".svg");
	if(this.animationState != 1){
		return;
	}
	if(indexUpTo < goUpTo){
		if(indexUpTo >= numSamples){
			this.animationState = 0;
			return
		}
		var circle = svg.selectAll("circle");
		var sample = this.samples[indexUpTo];
		var delay = 1;
		if(goSlow) delay = 1000;
		circle = circle.filter(function(d,i){return sample.indexOf(d) >= 0;});
		if(goSlow){
			circle = circle.transition().duration(delay).style("fill", "#FF7148").attr("fill-opacity", 1)
							.transition().duration(delay);
		}else{
			circle = circle.style("fill", "#FF7148").attr("fill-opacity", 1);
		}
		if(this.transitionSpeed <= 100){
			circle = circle.attr("cy", function(d, i){return d.yPerSample[indexUpTo+1]})
			.transition().duration(delay)
			.transition().duration(delay).attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.5)
			.each('end', function(d, i){ if(d == sample[0]){self.down(indexUpTo+jumps, goUpTo, goSlow, jumps)}});
		}else{
			circle = circle.transition().duration(this.transitionSpeed).attr("cy", function(d, i){return d.yPerSample[indexUpTo+1]})
			.transition().duration(delay)
			.transition().duration(delay).attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.5)
			.each('end', function(d, i){ if(d == sample[0]){self.down(indexUpTo+jumps, goUpTo, goSlow, jumps)}});
		}

		var sampMean = this.preCalculatedTStat.slice(indexUpTo+1, indexUpTo+jumps+1);

		var meanLines = svg.select(".sampleLines").selectAll("line").filter(function(d, i){
			return (i>=indexUpTo+1) && (i <indexUpTo+jumps+1);
		});
		if(goSlow){
			meanLines = meanLines.transition().delay(delay).duration(delay).style("opacity",1)
			.transition().duration(this.transitionSpeed).attr("y1", self.windowHelper.section2.bottom+10).attr("y2", self.windowHelper.section2.bottom-10).style("stroke", "steelblue")
			.transition().duration(this.transitionSpeed).style("opacity",0.2).style("stroke", "steelblue");
		}else{
			meanLines = meanLines.attr("y1", this.windowHelper.section2.bottom+10).attr("y2", this.windowHelper.section2.bottom-10).style("stroke", "steelblue").style("opacity",1).transition().duration(this.transitionSpeed).style("opacity",0.2);
		}

		var meanCircles = svg.select(".meanOfSamples").selectAll("circle").filter(function(d, i){
			return (i>=indexUpTo+1) && (i <indexUpTo+jumps+1);
		});
		if(this.transitionSpeed <= 100){
			meanCircles =meanCircles.attr("cy", function(d){return d.yPerSample[0]}).style("fill","red").transition().duration(this.transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").style("fill","#C7D0D5");
		}else{
			if(goSlow){
				meanCircles = meanCircles.transition().delay(delay*2 + self.transitionSpeed).attr("fill-opacity",(self.transitionSpeed * 0.001)).attr("stroke-opacity",(self.transitionSpeed * 0.001))
				.transition().duration(self.transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").attr("cy", function(d){return d.yPerSample[0]});
			}else{
				meanCircles = meanCircles.attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").transition().delay(this.transitionSpeed).duration(this.transitionSpeed).attr("cy", function(d){return d.yPerSample[0]});
			}
		}
		this.index += jumps;


	}else{
		this.animationState = 0;

	}
}

this.resetLines = function(){
	var self = this;
	var svg = d3.select(".svg");
	var meanLines = svg.select(".sampleLines").selectAll("line").attr("y1", this.windowHelper.section1.bottom+20).attr("y2", this.windowHelper.section1.bottom-20).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);

	var meanCircles = svg.select(".meanOfSamples").selectAll("circle")
	    .attr("cx", function(d, i) { 
	    	return d.xPerSample[0]; })
	    .attr("cy", function(d) {
	    	return d.yPerSample[0] - (self.windowHelper.section3.bottom- self.windowHelper.section2.bottom);
	    })
	    .attr("fill-opacity", 0)
	    .attr("stroke-opacity",0); 


}

this.pickRand = function(numToPick, numFrom){
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

this.findMean = function(numbers){
var total = 0;
for(var i = 0;i<numbers.length;i++){
	total += numbers[i];
}
return total/numbers.length;
}
this.findMeanItems = function(numbers){
var total = 0;
for(var i = 0;i<numbers.length;i++){
	total += numbers[i].value;
}
return total/numbers.length;
}



this.stop = function(){
this.animationState = 0;
}

this.destroyOne = function(){
	d3.select(".svg").selectAll("*").remove();
	d3.select(".svg").append("svg").attr("class","sampleLines");
	d3.select(".svg").append("svg").attr("class","meanOfSamples");
	this.resetDataOne();
	loadMain();
}

this.resetDataOne = function(){
	this.animationState = 0;
	this.windowHelpers = null;
	this.radius = 5;
	this.population = [];
	this.populationStatistic = null;
	this.samples = null;
	this.preCalculatedTStat = [];		
	this.transitionSpeed = 1000;
	this.index = 0;
	this.statsDone = false;

	this.animationState = 1000;
}
}