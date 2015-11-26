var oneMeanButton;
var twoMeanButton;
var dataScreen = null;
window.onload = function(){
	loadMain();
	loadData();
};
function twoMeanPressed(){
	d3.select(".controls").append("input").attr("name", "do1").attr("type", "button").attr("value","1 sample").attr("onClick", "startAnim2(1,true)");
	d3.select(".controls").append("input").attr("name", "do10").attr("type", "button").attr("value","10 samples").attr("onClick", "startAnim2(10, false)");
	d3.select(".controls").append("input").attr("name", "do1000").attr("type", "button").attr("value","1000 samples").attr("onClick", "startAnim2(1000, false)");
	d3.select(".controls").append("input").attr("name", "resetLines").attr("type", "button").attr("value","reset lines ").attr("onClick", "resetLines2()");
	d3.select(".controls").append("input").attr("name", "stop").attr("type", "button").attr("value","stop ").attr("onClick", "stop()");
	d3.select(".controls").append("input").attr("name", "back").attr("type", "button").attr("value","back ").attr("onClick", "destroy2()");
	oneMeanButton.remove();
	twoMeanButton.remove();
	startTwoMeans();
}
function oneMeanPressed(){
	dataScreen = startOneMean();
	d3.select(".controls").append("input").attr("name", "do1").attr("type", "button").attr("value","1 sample").attr("onClick", "dataScreen.startAnim(1,true)");
	d3.select(".controls").append("input").attr("name", "do10").attr("type", "button").attr("value","10 samples").attr("onClick", "dataScreen.startAnim(10, false)");
	d3.select(".controls").append("input").attr("name", "do1000").attr("type", "button").attr("value","1000 samples").attr("onClick", "dataScreen.startAnim(1000, false)");
	d3.select(".controls").append("input").attr("name", "resetLines").attr("type", "button").attr("value","reset lines ").attr("onClick", "dataScreen.resetLines()");
	d3.select(".controls").append("input").attr("name", "stop").attr("type", "button").attr("value","stop ").attr("onClick", "dataScreen.stop()");
	d3.select(".controls").append("input").attr("name", "back").attr("type", "button").attr("value","back ").attr("onClick", "dataScreen.destroyOne()");
	oneMeanButton.remove();
	twoMeanButton.remove();
	dataScreen.setUpPopulation();
	dataScreen.setUpSamples();
	dataScreen.draw();
	//startOneMean();
}
function loadMain(){
	d3.select(".controls").selectAll("*").remove();
	oneMeanButton = d3.select(".controls").append("input").attr("name", "oneMean").attr("type", "button").attr("value","Calculate one mean").attr("onClick", "oneMeanPressed()");
	twoMeanButton = d3.select(".controls").append("input").attr("name", "twoMean").attr("type", "button").attr("value","Calculate two mean").attr("onClick", "twoMeanPressed()");

}