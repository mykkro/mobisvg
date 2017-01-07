var NBackGame = Game.extend({
    constructor: function(config) {
        console.log("Starting N-Back game with config", config);
        this.base(config);
        this.x0 = 200;
        this.y0 = 200;
        this.cellSize = 200;
        this.currentFrame = 0;

        this.dualType = config.dualType;
        this.N = config.N;
        this.L = config.L;
        this.maxColors = Math.min(config.nColors, NBackGame.colors.length);
        this.maxSigns = Math.min(config.nSigns, NBackGame.signImages.length);
    },
    createBackground: function(r) {
        // create grid
        var self = this;
        this.r = r;
        var M = 3;
        var N = 3;
        var x0 = this.x0;
        var y0 = this.y0;
        var cellSize = this.cellSize;
        this.background = r.rect(x0, y0, M*cellSize, N*cellSize).attr({"fill":"white"});
        var lineStyle = { "stroke-width": 5, "stroke": "blue" };
        for(var x=1; x<M; x++) {
            r.line(x0+x*cellSize, y0, x0+x*cellSize, y0+N*cellSize).attr(lineStyle);
        }
        for(var y=1; y<N; y++) {
            r.line(x0, y0+y*cellSize, x0+M*cellSize, y0+y*cellSize).attr(lineStyle);
        }
        this.label = new HtmlLabelWidget(600, 500,{}, "");
        this.label.addClass("nback-counter");
        this.label.setPosition(200, 140);
        this.updateCounter();
    },
    updateCounter: function() {
        this.label.setText((this.currentFrame+1)+"/"+this.L);
    },
    animateBackground: function(btn) {
        console.log("Highlighting a button...");
        btn.box.addClass("highlighted");
        setTimeout(function() {
            btn.box.removeClass("highlighted");
        }, 100);
    },
    drawBox: function(r, col, row, color) {
        var cs = this.cellSize - 40;
        return r.rect(this.x0+col*this.cellSize+20, this.y0+row*this.cellSize+20, cs, cs).attr({"fill":color});
    },
    drawImage: function(r, col, row, image) {
        var cs = this.cellSize - 40;
        return r.image(image, this.x0+col*this.cellSize+20, this.y0+row*this.cellSize+20, cs, cs);
    },
    showFrame: function() {
    },
    indexAsPosition: function(index) {
        var px = index % 3;
        var py = Math.floor(index / 3);
        return { x: px, y: py };
    },
    generateTaskData: function(options) {
    }
}, {
    colors: [
        "red", "green", "blue", "yellow", "cyan", "magenta", "black", "orange", "brown", "teal"
    ],
    signImages: [
        "assets/signs/sign1.png",
        "assets/signs/sign2.jpg",
        "assets/signs/sign3.jpg",
        "assets/signs/sign4.jpg",
        "assets/signs/sign5.png",
        "assets/signs/sign6.png",
        "assets/signs/sign7.png",
        "assets/signs/sign8.png",
        "assets/signs/sign9.png",
        "assets/signs/sign10.jpg"
    ]
});
