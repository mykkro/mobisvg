// TimedGame.js

var TimedGame = Game.extend({
    constructor: function(config) {
        this.base(config);
        this.currentTime = 0;        
    },
    // override in subclasses
    // return a promise returning a gamepack
    loadGamepackData: function() {
        var self = this;
        var dfd = jQuery.Deferred();
        // call resolve when it is done
        dfd.resolve({});
        return dfd.promise();
    },
    start: function(gamedata) {
        this.base(gamedata);
        var self = this;
        console.log("TimedGame.start");

        self.loadGamepackData().done(function(gamepack) {
        	self.gamepackLoaded(gamepack);
        });
    },
    gamepackLoaded: function(gamepack) {
    	var self = this;
        console.log("TimedGame.gamepackLoaded", gamepack);
        self.gamepack = gamepack;
        self.initializeTask();
        self.renderFrame();
        self.startTimer();
    },
    // override in subclasses
    renderFrame: function() {
    	var self = this;
        console.log("TimedGame.renderFrame");
    },
    // override in subclasses...
    initializeTask: function() {
    	var self = this;
        self.answer = null;
        self.task = new NullTask();    	
    },
    // override in subclasses...
    generateReport: function(evalResult) {
        return [
            this.loc("Total time") + ": " + (evalResult.totalTime / 1000) + " s"
        ];
    },
    startTimer: function() {
        var self = this;
        self.currentTime = 0;
        var timer = new Timer();
        this.timer = timer;
        timer.start({precision: 'secondTenths', callback: function (values) {
            var elapsedMillis = values.secondTenths * 100 + values.seconds * 1000 + values.minutes * 60000 + values.hours * 3600000;
            self.currentTime = elapsedMillis;
            self.update(elapsedMillis);
        }});
    },
    // override in subclasses
    update: function(elapsedMillis) {
    	console.log("TimedGame.update", elapsedMillis);
    },
    abort: function() {
        this.base();       
        this.timer.stop(); 
    },
    finish: function(result) {
        this.timer.stop(); 
        this.base(result);       
    }
},{
});
