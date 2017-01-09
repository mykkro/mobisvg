// a specific type of game uses
// a specific game data model (task)
// and a GUI/presentation layer
var Game = Base.extend({
    constructor: function(config) {
        this.config = config;
        // baseUrl and loc will be overwritten by the app engine...
        this.baseUrl = "";
        this.loc = function(s) { return s; };
        console.log("Game config loaded: ", config);
    },
    createGUI: function(r) {
        // override in subclasses...
    },
    generateTaskData: function(options) {
        // generate data for game session
        return null;
    },
    start: function(gamedata) {
        this.gamedata = gamedata;
        this.onStart(gamedata);
    },
    abort: function() {
        console.log("Game aborted!");
        this.finished = true;
        this.onAbort();
    },
    finish: function(result) {
        console.log("Game finished!", result);
        this.finished = true;
        console.log("Validating the answer...");
        var messages = this.generateReport(this.task.evaluate(result));
        this.onFinish(result, messages);
    },
    generateReport: function(evalResult) {
        return ["Correctness: "+ sprintf("%.1f%%", evalResult.correctness * 100)];
    },
    onStart: function(val) {
        if(typeof(val)=="function") {
            this._onStart = val;
        } else if(this._onStart) {
            this._onStart(val);
        }
    },
    onAbort: function(val) {
        if(typeof(val)=="function") {
            this._onAbort = val;
        } else if(this._onAbort) {
            this._onAbort(val);
        }
    },
    onFinish: function(val, messages) {
        if(typeof(val)=="function") {
            this._onFinish = val;
        } else if(this._onFinish) {
            this._onFinish(val, messages);
        }
    }

});
