

var MentalRotationGame = Game.extend({
    constructor: function(config) {
        this.base(config);
        this.currentFrame = 0;
        this.totalFrames = 0;
    },
    createGUI: function(r) {
        // create grid
        r.rect(0,0,1000,1000).attr({ "fill":"ddd"});
        var self = this;

        this.label = new HtmlLabelWidget(600, 50,{}, "");
        this.label.addClass("counter");
        this.label.setPosition(200, 140);
        this.updateCounter();

        this.label2 = new HtmlLabelWidget(500, 300, {}, "Which of the shapes below is a rotated version of the shape shown left?");
        this.label2.addClass("instruction");
        this.label2.setPosition(300, 300);

    },
    updateCounter: function() {
        this.label.setText((this.currentFrame+1)+"/"+this.totalFrames);
    },
    generateTaskData: function(options) {
        return MentalRotationGame.data;
    },    
    renderFrame: function() {
        var self = this;
        this.updateCounter();
        var g = this.goals[this.currentFrame];
        console.log(g);

        $(".html-image-widget.item").empty();

        // render original...
        var img0 = new HtmlImageWidget(150, 150, {}, g.offered);
        img0.addClass("item item-offered");
        img0.setPosition(100, 300);        

        // render rest of items
        var y0 = 600;
        var n = g.rest.length;
        for(var i=0; i<n; i++) {
            (function() {
                var gg = g.rest[i];
                var img = new HtmlImageWidget(150, 150, {}, gg.item);
                img.addClass("item item-choice");
                img.setPosition(100 + 200*i, y0);     
                img.body.click(function()  {
                    // collect answer!
                    self.answer[self.currentFrame] = gg.match;
                    self.advanceFrame();
                });
            })();
        }
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
        self.totalFrames = self.gamedata.length;
        self.answer = [];
        self.goals = [];

        // prepare data...
        this.gamedata.forEach(function(gd) {
            console.log("Gamedata:", gd);
            var N = gd[2];
            // offered item will come from the first array
            // rest of items will be added to the second array            
            // total length of array = N
            var src = gd[0].slice();
            var ri = Math.floor(Math.random() * src.length); // Random Index position in the array
            var offered = src.splice(ri, 1);
            var rest = [];
            src.forEach(function(s) {
                rest.push({"item": s, "match": true});
            });
            gd[1].forEach(function(s) {
                rest.push({"item": s, "match": false});
            });
            shuffle(rest);
            rest.slice(0,N);

            console.log("Shuffled and selected:", offered, rest)

            self.goals.push({ offered:offered[0], rest:rest});
            self.answer.push(null);

        });

        self.task = new BinaryMultiTask();

        self.renderFrame();

    }
},{
    data: [
        // show 5 items, the first array - the "same" items, second array - the rest of items
        [["assets/a0.png", "assets/a1.png"], ["assets/a2.png", "assets/a3.png", "assets/a4.png"], 5],
        [["assets/b0.png", "assets/b1.png"], ["assets/b2.png", "assets/b3.png", "assets/b4.png"], 5],
        [["assets/c0.png", "assets/c1.png"], ["assets/c2.png", "assets/c3.png", "assets/c4.png"], 5]
    ]
});





