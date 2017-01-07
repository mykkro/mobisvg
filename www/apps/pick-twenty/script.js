

var PickTwentyGame = Game.extend({
    constructor: function(config) {
        this.base(config);
        this.locations = [];
        this.N = config.N;
        this.rotateGoals = config.rotateGoals;
    },
    isPlaceFree: function(x, y, rad) {
        console.log("Testing location:", x, y, rad);
        for(var i=0; i<this.locations.length; i++) {
            var xx = this.locations[i].x;
            var yy = this.locations[i].y;
            var rr = this.locations[i].radius;
            if((xx-x)*(xx-x) + (yy-y)*(yy-y) < (rr+rad)*(rr+rad)) {
                return false;
            }
        }
        return true;
    },
    placeGoal: function(x1, x2, y1, y2, rad, goal) {
        var p = randomPoint(x1, x2, y1, y2);
        while(!this.isPlaceFree(p.x, p.y, rad)) {
            p = randomPoint(x1, x2, y1, y2);
        }
        console.log(p);
        console.log("Placing goal: ", p.x, p.y, rad, goal);
        this.locations.push({x:p.x, y:p.y, radius:rad});
    },
    createGUI: function(r) {
        // create grid
        r.rect(0,0,1000,1000).attr({ "fill":"ddd"});
        var self = this;
    },
    generateTaskData: function(options) {
        return null;
    },    
    generateReport: function(evalResult) {
        return [
        "Total time: "+ sprintf("%.1f sec", evalResult.totalTime /1000),
        "Mistakes total: "+evalResult.mistakes
        ];
    },        
    start: function(gamedata) {
        this.base(gamedata);
        this.locations = [];
        this.mistakes = 0;
        var self = this;

        var minX = 100;
        var maxX = 900;
        var minY = 150;
        var maxY = 900;
        var rad = 70;
        for(var i=0; i<this.N; i++) {
            this.placeGoal(minX, maxX, minY, maxY, rad, ""+i);
        }
        self.numberButtons = [];
        for(var i=0; i<self.locations.length; i++) {
            var styles = ["rot0", "rot1", "rot2", "rot3", "rot4", "rot5", "rot6", "rot7", "rot8", "rot9", "rot10", "rot11"];
            var kinds = ["kind0", "kind1", "kind2"];
            var caption = (i+1)+"";
            if(i==5 || i==8) caption += ".";
            var klazz = "round-btn btn1 "+pickRandom(kinds);
            if(this.rotateGoals) {
                klazz = klazz + " " + pickRandom(styles)
            }
            var aa = new HtmlButtonWidget(100, 100, {"class":klazz, "backgroundColor":"cyan"}, caption);

            aa.setPosition(self.locations[i].x, self.locations[i].y);

            self.numberButtons.push(aa);
            self.counter = 0;

            aa.onClick(function(btn) {
                // which index?
                var ndx = -1;
                for(var i=0; i<self.numberButtons.length; i++) {
                    if(btn == self.numberButtons[i]) {
                        ndx = i;
                        break;
                    }
                }
                var elapsedTime = new Date().getTime() - self.startTime;
                if(self.counter == ndx) {
                    console.log("Correct!", self.counter, elapsedTime);
                    // log success (time) + relevant data
                    btn.addClass("correct");
                    setTimeout(function() {
                        btn.removeClass("correct");
                    }, 1000);
                    self.counter++;
                    if(self.counter==self.N) {
                        console.log("Well done!", elapsedTime);
                        // log completion (total duration, etc.)
                        self.finish({totalTime: elapsedTime, mistakes: self.mistakes});
                    }
                } else {
                    console.log("Incorrect!", self.counter, elapsedTime);
                    // log error (time) + relevant data
                    self.mistakes++;
                    btn.addClass("incorrect");
                    setTimeout(function() {
                        btn.removeClass("incorrect");
                    }, 1000);
                }

            });
        }

        self.task = new NullTask();
        self.startTime = new Date().getTime();        

    }
},{
});





