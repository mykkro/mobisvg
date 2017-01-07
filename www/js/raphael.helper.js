// various RaphaelJS helper functions

RaphaelHelper = {}

/**
 * Draws a grid spanning 1000 x 1000 units.
 */
RaphaelHelper.drawGrid = function(r, color) {
    var grid = r.set();
    var thinLineStyle = {stroke: color,"stroke-width": 1, fill: "none"};
    var thickLineStyle = {stroke: color,"stroke-width": 3, fill: "none"};
    for(var i=0; i<100; i++) {
    	var line = r.path("M0," + i*10 + " L1000," + i*10).attr(thinLineStyle);
    	grid.push(line);
    	var line = r.path("M" + i*10 + ",0L" + i*10 + ",1000").attr(thinLineStyle);
    	grid.push(line);
    }
    for(var i=0; i<10; i++) {
    	var line = r.path("M0," + i*100 + " L1000," + i*100).attr(thickLineStyle);
    	grid.push(line);
    	var line = r.path("M" + i*100 + ",0L" + i*100 + ",1000").attr(thickLineStyle);
    	grid.push(line);
    }
    return grid;
}


Raphael.fn.line = function(startX, startY, endX, endY){
    return this.path('M' + startX + ' ' + startY + ' L' + endX + ' ' + endY);
};
