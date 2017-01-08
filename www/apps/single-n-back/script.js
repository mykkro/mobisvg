


var NBackSingleGame = NBackGame.extend({
    constructor: function(config) {
        this.base(config);
    },
    createGUI: function(r) {
        // create grid
        var self = this;
        self.createBackground(r);
        // create buttons
        var useColors = true;

        this.button1 = new ButtonWidget("Position", {fontSize: 40, border: 20, anchor: "middle", radius: 30});
        this.button1.setPosition(500-this.button1.w/2, 850);
        this.button1.onClick(function() {
            if(self.currentFrame >= self.N) {
                player.playSound("click");
                self.answer[self.currentFrame-self.N] = 1;
            }
        });
    },
    showFrame: function() {
        var self = this;
        if(this.currentFrame == this.gamedata.length) {
            this.finish(this.answer);
        } else {
            var data = self.gamedata[self.currentFrame];
            var p = self.indexAsPosition(data);
            self.lastBox = self.drawBox(r, p.x, p.y, "blue");
            player.playSound("new-box");
        }
    },
    generateTaskData: function(options) {
        var sequence = [], sequence1=[], sequence2=[];
        for(var i=0; i<this.L; i++) {
            sequence.push(randomInt(9));
        }        
        return sequence;
    },
    start: function(gamedata) {
        this.base(gamedata);
        this.task = new NBackScalarTask(gamedata, this.N);
        this.answer = [];
        for(var i=0; i<this.L-this.N; i++) {
            this.answer.push(0);
        }
        this.startTimer();
    }
});

