


var MagicSquareGame = Game.extend({
    constructor: function(config) {
        this.base(config);
        this.currentFrame = 0;
    },
    createGUI: function(r) {
        // create grid
        r.rect(0,0,1000,1000).attr({ "fill":"ddd"});
        var self = this;
        var btn = new HtmlButtonWidget(200, 100, {"class":"btn3"}, "OK");
        btn.setDisabled(true);
        btn.setPosition(400, 800);
        btn.onClick(function() {
            var answers = self.lastFrame.val();
            answers = answers.map(function(a) {
                return parseInt(a);
            });
            console.log("Finished!", answers);
            self.finish(answers);
        })
        this.okButton = btn;
    },
    generateTaskData: function(options) {
        return MagicSquareGame.sequences;
    },
    renderFrame: function() {
        var self = this;
        var vgap = 60;
        var grid = new HtmlGridInputWidget(600, 600, 3, 3, {"gap": 10, "filledReadonly": true, "numbersOnly": true, "maxlength": 2}, this.series);
        grid.setPosition(200, 150);
        grid.onChange(function(val) {
            console.log(val, grid.isFilled());
            self.okButton.setDisabled(!grid.isFilled());
        });
        this.lastFrame = grid;
    },
    start: function(gamedata) {
        this.base(gamedata);
        //this.task = new SequenceBinaryTask(gamedata[0], gamedata[1]);
        this.task = new MagicSquareBinaryTask(gamedata[0], gamedata[1], gamedata[2], false);
        var seq = this.gamedata[0];
        var mask = this.gamedata[1];
        var series = this.task.question();
        this.series = series;

        this.renderFrame();

    }
},{
    sequences: 
        [ [40, 30, 30, 25, 50, 25, 35, 20, 45 ], [1,0,1,0,1,0,1,0,0], 100 ]
});
