


var SudokuGame = Game.extend({
    constructor: function(config) {
        this.base(config);
    },
    // set default embedding options for this Game
    getEmbeddingOptions: function() {
        return {
            renderTitle: true,
            renderAbortButton: true
        };
    },
    createGUI: function(r) {
        var self = this;
        this.body = new GroupWidget(); 
        // create Sudoku GUI here...
    },
    generateTaskData: function(options) {
        return null;
    },            
    renderFrame: function() {
        var self = this;
        //this.body.clearContents();
        // nothing to do here...
    },
    loadGamepack: function(name) {
        var self = this;
        var dfd = jQuery.Deferred();
        var gamepackUrl = self.baseUrl + "/gamepacks/" + name;
        self.gamepackUrl = gamepackUrl;
        $.getJSON(gamepackUrl + "/gamepack.json").done(function(gamepack) {
            console.log("Gamepack data loaded:", gamepack);
            // call resolve when it is done
            dfd.resolve(gamepack);
        });
        return dfd.promise();
    },
    start: function(gamedata) {
        this.base(gamedata);
        var self = this;
        console.log("Sudoku:start");

        // choose a gamepack
        var gamepackName = "default";
        self.loadGamepack(gamepackName).done(function(gamepack) {
            console.log("Gamepack loaded", gamepack);
            self.gamepack = gamepack;
            self.answer = null;
            self.task = new NullTask();
            self.startTimer();
            self.renderFrame();
        });
    },
    generateReport: function(evalResult) {
        return [            
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
            console.log("Time", self.currentTime);
        }});
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
