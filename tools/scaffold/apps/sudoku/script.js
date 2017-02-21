


var SudokuGame = Game.extend({
    constructor: function(config) {
        this.base(config);
        this.solver = new Sudoku();
        this.cellsize = 90;
        this.x0 = 95;
        this.y0 = 95;
        this.showMistakes = this.config.showMistakes;
    },
    // set default embedding options for this Game
    getEmbeddingOptions: function() {
        return {
            renderTitle: false,
            renderAbortButton: true
        };
    },
    createGUI: function(r) {
        var self = this;
        // create Sudoku GUI here...
        this.drawBackground();
        // create text labels...
        this.cells = [];
        this.editables = [];
        this.errors = [];
        for(var i = 0; i < 9; i++) {
            var cc = [];
            var ee = [];
            var ff = [];
            for(var j = 0; j < 9; j++) {
                var cell = self.makeCell(i, j);
                cc.push(cell);
                ee.push(false);
                ff.push(false);
            }
            self.cells.push(cc);
            self.editables.push(ee);
            self.errors.push(ff);
        }
        this.body = new GroupWidget(); 
    },
    drawBackground: function() {
        var xsize = 9 * this.cellsize;
        var ysize = 9 * this.cellsize;
        var bkgr = r.rect(this.x0, this.y0, xsize, ysize);
        bkgr.attr({"stroke": "none", "fill": "white"});        
        var thickLineStyle = {"stroke": "black", "stroke-width": "3"};
        var thinLineStyle = {"stroke": "black", "stroke-width": "1"};
        for(var i=0; i<10; i++) {
            var style = (i%3 == 0) ? thickLineStyle : thinLineStyle;
            r.line(this.x0, this.y0+i*this.cellsize, this.x0+xsize, this.y0+i*this.cellsize).attr(style);
            r.line(this.x0+i*this.cellsize, this.y0, this.x0+i*this.cellsize, this.y0+ysize).attr(style);
        }
    },
    generateTaskData: function(options) {
        return null;
    },            
    renderFrame: function() {
        var self = this;

        // initialize each cell.
        for(var i = 0; i < 9; i++) {
            for(var j = 0; j < 9; j++) {
                self.setCell(i, j, self.solver.getVal(i, j));
            }
        }

        this.solver.done = function() {
            //console.log("done");
            // update the board with the new puzzle data.
            for(var i = 0; i < 9; i++) {
                for(var j = 0; j < 9; j++) {
                    var value = self.solver.getVal(i, j);
                    self.setCell(i, j, value);
                    self.editables[i][j] = (value == 0);
                }
            }
            console.log("Board updated!");
            self.body.clearContents();
            for(var i = 0; i < 9; i++) {
                for(var j = 0; j < 9; j++) {
                    if(self.editables[i][j]) {
                        var xx = self.x0 + self.cellsize*j;
                        var yy = self.y0 + self.cellsize*i;
                        var rr = new RectWidget(self.cellsize, self.cellsize);
                        rr.setPosition(xx, yy);
                        rr.setStyle({"fill": "cyan", "opacity": 0.3});
                        var cc = new Clickable(rr);
                        (function() {
                            var ii = i;
                            var jj = j;
                            cc.onClick(function() {
                                self.clickCell(ii, jj);
                            });
                        })();
                        self.body.addChild(cc);
                    }
                }
            }
        };

        // generate the new puzzle.
        this.solver.newGame();
    },    
    clickCell: function(i, j) {
        var self = this;
        var oldval = self.solver.getVal(i, j);
        var newval = (oldval+1)%10;
        self.setCell(i, j, newval);  
        self.solver.setVal(i, j, newval);
        self.checkCell(i, j);
        // check to see if the game is done.
        var val = 0;
        if((val = this.solver.gameFinished()) != 0)
        {
            console.log("Game finished!", val);
            this.timer.stop();
            // total time: in seconds
            this.answer = { totalTime: Math.floor(this.currentTime / 1000) };
            this.notifyFinished(function() {
                self.finish(self.answer);
            });

        }
    },
    notifyFinished: function(callback) {
        // TODO show modal splash dialog
        setTimeout(callback, 500);
    },
    checkCell: function(row, col) {
        for (var i = 0; i < 9; i++)
        {
            var val = this.solver.getVal(row, i);
            if(this.solver.checkVal(row, i, val) == true)
                this.errors[row][i] = false;
            else
                this.errors[row][i] = true;
        }

        for (var i = 0; i < 9; i++)
        {
            var val = this.solver.getVal(i, col);
            if(this.solver.checkVal(i, col, val) == true)
                this.errors[i][col] = false;
            else
                this.errors[i][col] = true;
        }

        var r = row - row % 3;
        var c = col - col % 3;
        for(var i = r; i < r + 3; i++) {
            for(var j = c; j < c + 3; j++) {
                var val = this.solver.getVal(i, j);
                if(this.solver.checkVal(i, j, val) == true)
                    this.errors[i][j] = false;
                else
                    this.errors[i][j] = true;
            }
        }
        this.updateErrorView();
    },
    updateErrorView: function() {
        console.log("Errors:", this.errors);
        for(var i = 0; i < 9; i++) {
            for(var j = 0; j < 9; j++) {
                this.updateCellErrorView(i, j, this.errors[i][j]);
            }
        }
    },
    updateCellErrorView: function(row, col, err) {
        this.cells[row][col].setStyle({fill: (err && this.showMistakes) ? "red" : "black"});
    },
    makeCell: function(i,j) {
        var labelSvg = new TextWidget(this.cellsize,this.cellsize*0.8, "middle", "");
        labelSvg.setPosition(this.x0 + j*this.cellsize, this.y0 + this.cellsize*0.15 + i*this.cellsize)
        labelSvg.setStyle({"fill": "black"}); 
        labelSvg.setCssClass("sudoku-digit");
        return labelSvg;
    },
    setCell: function(i, j, value) {
        console.log("Set value:", i, j, value)
        this.cells[i][j].setText(value==0 ? "" : ""+value);
        this.cells[i][j].setCssClass("sudoku-digit");
    },
    loadGamepackData: function() {
        var self = this;
        var dfd = jQuery.Deferred();
        // call resolve when it is done
        // sudoku - empty gamepack so far...
        dfd.resolve({});
        return dfd.promise();
    },
    start: function(gamedata) {
        this.base(gamedata);
        var self = this;
        console.log("Sudoku:start");

        self.loadGamepackData().done(function(gamepack) {
            console.log("Gamepack loaded", gamepack);
            self.gamepack = gamepack;
            self.answer = null;
            self.task = new NullTask();
            self.startTimer();
            self.renderFrame();
        });
    },
    generateReport: function(evalResult) {
        return [
            this.loc("Total time") + ": " + evalResult.totalTime
        ];
    },
    startTimer: function() {
        var self = this;
        self.currentTime = 0;
        var timer = new Timer();
        this.timer = timer;
        timer.start({precision: 'secondTenths', callback: function (values) {
            var elapsedMillis = values.secondTenths * 100 + values.seconds * 1000 + values.minutes * 60000 + values.hours * 3600000;
            self.currentTime = elapsedMillis;
            //console.log("Time", self.currentTime);
        }});
    },
    abort: function() {
        this.base();       
        this.timer.stop(); 
    },
    finish: function(result) {
        this.timer.stop(); 
        this.base(result);       
    }
},{
});
