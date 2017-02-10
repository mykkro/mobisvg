


var SequencesGame = Game.extend({
    constructor: function(config) {
        this.base(config);
        this.pageSize = 3;
        this.currentFrame = 0;
        this.lastFrame = null;
        this.pages = 1;
    },
    createGUI: function(r) {
        // create grid
        r.rect(0,0,1000,1000).attr({ "fill":"ddd"});
        var self = this;
        var btn = new HtmlButtonWidget(200, 100, {"class":"btn3"}, "OK");
        btn.setDisabled(true);
        btn.setPosition(400, 800);
        btn.onClick(function() {
            self.advanceFrame();
        })
        this.okButton = btn;
        this.label = new HtmlLabelWidget(600, 500,{}, "");
        this.label.addClass("counter");
        this.label.setPosition(200, 140);
        this.updateCounter();
    },
    updateCounter: function() {
        this.label.setText((this.currentFrame+1)+"/"+this.pages);
    },
    generateTaskData: function(options) {
        return SequencesGame.sequences;
    },
    advanceFrame: function() {
        var self = this;
        self.currentFrame++;    
        // gather answers...
        var answers = this.lastFrame.val();
        // convert strings in answer to upper case...
        answers.forEach(function(a) {
            self.answer.push(a.map(function(i) {
                return i.toUpperCase();
            }));
        });
        console.log("Answers:", answers, self.answer);
        // remove old inputs...
        $(".html-series-input-widget").remove();
        if(self.currentFrame*self.pageSize < self.series.length) {
            // go to next frame
            self.renderFrame();
        } else {
            console.log("Finished!", self.answer);
            this.finish(this.answer);
        }
    },
    renderFrame: function() {
        var frm = this.currentFrame;
        var len = this.series.length;        
        var offset = frm * this.pageSize;
        var cnt = Math.min(len-offset, 3);
        var series = this.series.slice(offset, offset+cnt);
        var self = this;
        this.pages = Math.floor((len+2)/3);
        this.updateCounter();    
        var vgap = 60;
        var ss = new HtmlMultiSeriesInputWidget(800, series.length*(100+vgap), {"gap": 20, "vgap": vgap, "filledReadonly": true, "maxlength": 2, "lettersOnly": false}, series);
        ss.setPosition(100, 200);
        ss.onChange(function(val) {
            console.log(val, ss.isFilled());
            self.okButton.setDisabled(!ss.isFilled());
        });
        this.lastFrame = ss;
    },
    start: function(gamedata) {
        this.base(gamedata);
        this.task = new MultiSequenceTask(gamedata);
        this.answer = [];
        this.currentFrame = 0;

        var series = []
        for(var i=0; i<this.gamedata.length; i++) {
            var seq = this.gamedata[i][0];
            var mask = this.gamedata[i][1];
            var pattern = [];
            for(var j=0; j<seq.length; j++) {
                pattern.push(mask[j]==0 ? null : seq[j]);
            }
            series.push(pattern);
        }
        this.series = series;

        this.renderFrame();

    }
},{
    sequences: [
        [ [1,3,5,7,9], [1,1,1,1,0] ],
        [ [1,4,16,25,36], [1,1,1,1,0] ],
        [ [1,3,7,15,31], [1,1,1,1,0] ],
        [ [4,5,7,10,13], [1,1,1,1,0] ],
        [ ["A","C","E","G","I"], [1,1,1,1,0] ],
        [ ["K","K","L","L","M"], [1,1,1,1,0] ]
    ]
});
