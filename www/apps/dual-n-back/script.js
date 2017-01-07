
var NBackDualGame = NBackGame.extend({
    constructor: function(config) {
        this.base(config);
    },
    createGUI: function(r) {
        // create grid
        var self = this;
        this.r = r;
        self.createBackground(r);
        // create buttons
        var useColors = true;
        this.button1 = new HtmlButtonWidget(200, 100, {"class":"btn3"}, "Position");
        this.button1.setPosition(250, 850);
        this.button1.onClick(function() {
            self.animateBackground(self.button1);
            if(self.currentFrame >= self.N) {
                self.answer[0][self.currentFrame-self.N] = 1;
            }
        });
        this.button2 = new HtmlButtonWidget(200, 100, {"class":"btn3"}, this.dualType=="colors" ? "Color" : "Sign");
        this.button2.setPosition(550, 850);
        this.button2.onClick(function() {
            self.animateBackground(self.button2);
            if(self.currentFrame >= self.N) {
                self.answer[1][self.currentFrame-self.N] = 1;
            }
        });
    },
    showFrame: function() {
        var self = this;
        var delay1 = 1000;
        var delay2 = 2000;        
        if(this.currentFrame == this.gamedata[0].length) {
            this.finish(this.answer);
        } else {
            var data1 = self.gamedata[0][self.currentFrame];
            var data2 = self.gamedata[1][self.currentFrame];
            var p = self.indexAsPosition(data1);
            if(self.dualType == "colors") {
                self.lastBox = self.drawBox(r, p.x, p.y, NBackGame.colors[data2]);
            } else {
                self.lastBox = self.drawImage(r, p.x, p.y, NBackGame.signImages[data2]);
            }
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
            sequence1.push(randomInt(9));
            sequence2.push(randomInt(this.dualType == "colors" ? this.maxColors : this.maxSigns));
        }        
        return [sequence1, sequence2];
    },
    start: function(gamedata) {
        this.base(gamedata);
        this.task = new NBackDualScalarTask(gamedata, this.N);
        this.answer = [[],[]];
        for(var i=0; i<this.L-this.N; i++) {
            this.answer[0].push(0);
            this.answer[1].push(0);
        }
        this.currentFrame = 0;
        this.lastBox = null;
        this.showFrame();
    }
});


