


var ReactionTimeGame = Game.extend({
    constructor: function(config) {
        this.base(config);
        this.totalFrames = 0;
        this.currentFrame = 0;
    },
    createGUI: function(r) {
        var labelSvg = new TextWidget(600, 50, "middle", "");
        labelSvg.setPosition(200, 140)
        labelSvg.setStyle({"fill": "black"});        
        this.label = labelSvg;
    },
    showFrame: function() {
        this.updateCounter();
        var self = this;        
        if(this.currentFrame == this.totalFrames) {
            this.finish(this.answer);
        } else {
            console.log("Show frame:", this.currentFrame);
        }
    },
    start: function(gamedata) {
        this.base(gamedata);
        this.totalFrames = this.gamedata.length;
        this.task = new NullTask();
        this.startTimer();
    },
    checkFrame: function(elapsedMillis) {
        if(this.finished) {
            this.timer.stop();
            return;
        }
        var delay1 = 1000;
        var delay2 = 2000;
        //console.log("Time: ", elapsedMillis, "Frame:", this.currentFrame, "Last time:", this.lastFrameTime);
        if((elapsedMillis >= this.lastFrameTime + delay1) && this.lastBox) {
            this.lastBox.remove();
            this.lastBox = null;
        }
        if(elapsedMillis >= this.lastFrameTime + delay1 + delay2) {
            this.currentFrame++;
            this.lastFrameTime += (delay1 + delay2);
            this.updateCounter();
            this.showFrame();
        }
    },
    updateCounter: function() {
        this.label.setText((this.currentFrame+1)+"/"+this.totalFrames);
    },
    startTimer: function() {
        this.currentFrame = 0;
        this.lastBox = null;
        this.showFrame();
        var self = this;
        var timer = new Timer();
        this.timer = timer;
        this.lastFrameTime = 0;
        timer.start({precision: 'secondTenths', callback: function (values) {
            var elapsedMillis = values.secondTenths * 100 + values.seconds * 1000 + values.minutes * 60000 + values.hours * 3600000;
            self.checkFrame(elapsedMillis);
        }});
    },
    generateTaskData: function(options) {
        return [1,2,3,4,5,6,7,8,9,10];
    },
    abort: function() {
        this.base();       
        this.timer.stop(); 
    }

});

