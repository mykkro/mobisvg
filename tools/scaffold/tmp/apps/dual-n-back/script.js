
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

        var buttonStyle = {fontSize: 40, border: 20, anchor: "middle", radius: 30};

        this.button1 = new ButtonWidget(this.loc("Position"), buttonStyle);
        this.button1.setPosition(300-this.button1.w/2, 850);
        this.button1.onClick(function() {
            player.playSound("click");
            if(self.currentFrame >= self.N) {
                self.answer[0][self.currentFrame-self.N] = 1;
            }
        });
        this.button2 = new ButtonWidget(this.dualType=="colors" ? this.loc("Color") : this.loc("Sign"), buttonStyle);
        this.button2.setPosition(500-this.button2.w/2, 850);
        this.button2.onClick(function() {
            player.playSound("click");
            if(self.currentFrame >= self.N) {
                self.answer[1][self.currentFrame-self.N] = 1;
            }
        });
        this.button3 = new ButtonWidget(this.loc("Both"), buttonStyle);
        this.button3.setPosition(700-this.button2.w/2, 850);
        this.button3.onClick(function() {
            player.playSound("click");
            if(self.currentFrame >= self.N) {
                self.answer[0][self.currentFrame-self.N] = 1;
                self.answer[1][self.currentFrame-self.N] = 1;
            }
        });
    },
    showFrame: function() {
        var self = this;
        if(this.currentFrame == this.gamedata[0].length) {
            this.finish(this.answer);
        } else {
            var data1 = self.gamedata[0][self.currentFrame];
            var data2 = self.gamedata[1][self.currentFrame];
            var p = self.indexAsPosition(data1);
            if(self.dualType == "colors") {
                self.lastBox = self.drawBox(r, p.x, p.y, NBackGame.colors[data2]);
            } else {
                self.lastBox = self.drawImage(r, p.x, p.y, self.baseUrl + "/"+ NBackGame.signImages[data2]);
            }
            player.playSound("newBox");
        }
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
        this.startTimer();
    }
});


