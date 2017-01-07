


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
        this.button1 = new HtmlButtonWidget(200, 100, {"class":"btn3"}, "Position");
        this.button1.setPosition(400, 850);
        this.button1.onClick(function() {
            if(self.currentFrame >= self.N) {
                self.animateBackground(self.button1);
                self.answer[self.currentFrame-self.N] = 1;
            }
        });
    },
    showFrame: function() {
        var self = this;
        var delay1 = 1000;
        var delay2 = 2000;        
        if(this.currentFrame == this.gamedata.length) {
            this.finish(this.answer);
        } else {
            var data = self.gamedata[self.currentFrame];
            var p = self.indexAsPosition(data);
            self.lastBox = self.drawBox(r, p.x, p.y, "blue");
        }
        if(this.finished) {
            return;
        }
        self.updateCounter();
        // if delay - start timer...
        setTimeout(function() {
            if(self.lastBox) {
                self.lastBox.remove();
            }
            if(this.finished) {
                return;
            }
            setTimeout(function() {
                self.currentFrame++;
                self.showFrame();
            }, delay2);
        }, delay1);
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
        this.currentFrame = 0;
        this.lastBox = null;
        this.showFrame();
    },
    abort: function() {
        this.base();        
    }
});

