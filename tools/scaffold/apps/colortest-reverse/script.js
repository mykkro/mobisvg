

var ReverseColorTestGame = Game.extend({
    constructor: function(config) {
        this.base(config);
        this.currentFrame = 0;
        this.N = config.N;
        this.totalFrames = this.N;
    },
    createGUI: function(r) {
        // create grid
        var self = this;

        var labelSvg = new TextWidget(600, 50, "middle", "");
        labelSvg.setPosition(200, 160)
        labelSvg.setStyle({"fill": "black"});
        this.label = labelSvg;
        this.updateCounter();

        this.body = new GroupWidget(); 
    },
    updateCounter: function() {
        this.label.setText((this.currentFrame+1)+"/"+this.totalFrames);
    },
    generateTaskData: function(options) {
        var availableColors = ["red", "green", "blue", "yellow"];
        var sequenceLength = this.N;
        var matchedCount = 4;

        var correctIndices = makeRange(sequenceLength).shuffle();
        var correct = {};
        for(var i=0; i<matchedCount; i++) {
            correct[correctIndices[i]] = true;
        }

        var out = [];
        for(var i=0; i<sequenceLength; i++) {
            var labelColor = pickRandom(availableColors);
            var color = labelColor;
            if(!(i in correct)) {
                var otherColors = availableColors.slice(0);
                otherColors.remove(labelColor);
                color = pickRandom(otherColors);
            }
            out.push({label: labelColor, color: color});
        }

        // TODO color names must be localized
        return out;
    },    
    _colorButton: function(color, x, y, callback) {
        var r1 = new RectWidget(180, 180);
        r1.setStyle({"fill":color, "stroke":"none"});
        r1.setPosition(x, y);
        var c1 = new Clickable(r1);
        c1.onClick(function() {
            callback(color);
        });
        return c1;
    },
    renderFrame: function() {
        var self = this;
        this.body.clearContents();

        this.updateCounter();
        var g = this.goals[this.currentFrame];
        console.log(g);

        var _colorSelected = function(color) {
            var matched = (color == g.color);
            self.answer[self.currentFrame] = matched;
            self.body.clearContents();
            setTimeout(function() {
                self.advanceFrame();
            }, 500);            
        };

        var c1 = this._colorButton("red", 200, 300, _colorSelected);
        var c2 = this._colorButton("blue", 620, 300, _colorSelected);
        var c3 = this._colorButton("green", 200, 720, _colorSelected);
        var c4 = this._colorButton("yellow", 620, 720, _colorSelected);
        this.body.addChild(c1);
        this.body.addChild(c2);
        this.body.addChild(c3);
        this.body.addChild(c4);

        var labelSvg = new TextWidget(600, 100, "middle", this.loc(g.label));
        labelSvg.setPosition(200, 550)
        labelSvg.setStyle({"fill": g.color});    
        this.body.addChild(labelSvg);    
    },
    advanceFrame: function() {
        this.currentFrame++;
        if(this.currentFrame == this.goals.length) {
            this.finish(this.answer);
        } else {
            this.renderFrame();
        }
    },
    start: function(gamedata) {
        this.base(gamedata);

        var self = this;
        this.currentFrame = 0;
        self.totalFrames = gamedata.length;
        self.answer = [];
        self.goals = [];

        // prepare data...
        this.gamedata.forEach(function(gd) {
            console.log("Gamedata:", gd);
            self.goals.push(gd);
            self.answer.push(null);
        });

        self.task = new BinaryMultiTask();

        self.renderFrame();

    }
},{
});





