var TwentyFortyEight = TimedGame.extend({

	constructor: function(config) {
        this.base(config);
	},

	/**
	 *  Creates a matrix filled by a value.
	 */
	createMatrix: function(rows, cols, value) {
	    var mat = [];
	    var filler = value || 0;
	    if(typeof(value) != "function") {
	        filler = function(row, col) {
	            return value;
	        }
	    }
        for(var i=0; i<rows; i++) {
            var row = [];
            for(var j=0; j<cols; j++) {
                row.push(filler(i, j));
            }
            mat.push(row);
        }
        return mat;
	},
	forEachInMatrix: function(matrix, fun) {
        for(var i=0; i<matrix.length; i++) {
            for(var j=0; j<matrix[0].length; j++) {
                fun(matrix[i][j], i, j);
            }
        }
	},
    swapMatrixValues: function(matrix, row1, col1, row2, col2) {
        var val1 = matrix[row1][col1];
        var val2 = matrix[row2][col2];
        matrix[row1][col1] = val2;
        matrix[row2][col2] = val1;
    },

	renderBoard: function() {
	    console.log("TwentyFortyEight.renderBoard");
        var self = this;

        var gridRows = 4;
        var gridCols = 4;
        var x = 100;
        var y = 100;
        var width = 800;
        var height = 800;
        var tileWidth = Math.floor(width / gridCols);
        var tileHeight = Math.floor(height / gridRows);

        this.numberOfMoves = 0;

        // return position where to draw grid cell with coordinates (gridX,gridY)
        this.gridPos = function(gridX,gridY) {
            return { x: x + gridX * tileWidth, y: y + gridY * tileHeight };
        }

        this.tileBackgroundMatrix = this.createMatrix(gridRows, gridCols, function(r, c) {
            var index = c + r*gridCols;
            var tile = self.gamepack.tileset.tiles[0].url;
            var img = new ImageWidget(self.tilesetBaseUrl + "/" + tile, tileWidth, tileHeight);
            var pos = self.gridPos(c, r);
            img.setPosition(pos.x, pos.y);
            return img;
        });

        this.tileMatrix = this.createMatrix(gridRows, gridCols, function(r, c) {
            var index = c + r*gridCols;
            var tile = self.gamepack.tileset.tiles[0].url;
            var img = new ImageWidget(self.tilesetBaseUrl + "/" + tile, tileWidth, tileHeight);
            var pos = self.gridPos(c, r);
            img.setPosition(pos.x, pos.y);
            return img;
        });

        var numbers;
        var finished = false;
        var game2048 = new Game2048();
        console.log(game2048);
        game = game2048;

  
        var lookup = {
            0: "empty",
            1: "pow0",
            2: "pow1",
            4: "pow2",
            8: "pow3",
            16: "pow4",
            32: "pow5",
            64: "pow6",
            128: "pow7",
            256: "pow8",
            512: "pow9",
            1024: "pow10",
            2048: "pow11",
            4096: "pow12",
            8192: "pow13",
            16384: "pow14"
        };

        numbers = new Grid(4, 4);
        /*        
        var numbersView = new GridView(numbers, "numbers", function(el, i, j, value) {
            // console.log("Minefield view", gw, i, j, value);      
            var tile = lookup[value];       
            el.attr("class", "tile "+tile);
        });
        */

        var ts = self.gamepack.tileset.tiles;
        var tsmap = {};
        ts.forEach(function(t) { tsmap[t.name] = self.tilesetBaseUrl + "/" + t.url;});
        console.log(tsmap);

        var updateView = function() {
            for(var i=0; i<4; i++) {
                for(var j=0; j<4; j++) {
                    var val = game.board[i][j];
                    numbers.setValue(i, j, val);
                    console.log(i,j,val, lookup[val], tsmap[lookup[val]]);
                    self.tileMatrix[i][j].setSrc(tsmap[lookup[val]]);
                }
            }
        }

        var moveLeft = function() {
            move('left');
        }

        var moveRight = function() {
            move('right');
        }

        var moveUp = function() {
            move('up');
        }

        var moveDown = function() {
            move('down');
        }

        var move = function(direction) {
            try {
                game.move(direction);
                updateView();
                self.numberOfMoves++;
            }
            catch(e) {
                alert("No more moves!");
                finished = true;
            }          
        }

        // universal click event - for web and mobile alike
        // TODO support for drag events, swipe...
        var setClick = function(element, callback) {
            if(MOBILE) {
                element.touchstart(function() { callback(); });
            } else {
                element.mousedown(function() { callback(); });            
            }
            return element;
        }

        // set-up clickable regions...
        var regStyle = {fill:"cyan", opacity: 0.001, stroke: "none"};
        var regLeft = setClick(r.circle(x, y+height/2, 280).attr(regStyle), moveLeft);
        var regRight = setClick(r.circle(x+width, y+height/2, 280).attr(regStyle), moveRight);
        var regUp = setClick(r.circle(x+width/2, y, 280).attr(regStyle), moveUp);
        var regDown = setClick(r.circle(x+width/2, y+height, 280).attr(regStyle), moveDown);

        updateView();

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
        this.body = new GroupWidget();
    },
    generateTaskData: function(options) {
        return null;
    },            
    renderFrame: function() {
        this.renderBoard();
    },    
    loadGamepackData: function() {
        var self = this;
        var name = self.meta.gamepackName;
        var dfd = jQuery.Deferred();
        var gamepackUrl = self.meta.appBaseUrl + "/gamepacks/" + name;
        var tilesetUrl = self.meta.appBaseUrl + "/"+ self.meta.res("tileset")
        $.getJSON(tilesetUrl).done(function(tileset) {
            console.log("Tileset data loaded:", tileset, tilesetUrl);
            // call resolve when it is done
            dfd.resolve({name:name, url:gamepackUrl, tilesetUrl: tilesetUrl, tileset:tileset});
        });
        return dfd.promise();
    },
    initializeTask: function() {
        this.task = new NullTask();
        this.answer = null;
        this.tilesetBaseUrl = dirname(this.gamepack.tilesetUrl);
        console.log("Fifteen.initializeTask", this.tilesetBaseUrl);
    },
    generateReport: function(evalResult) {
        return [
            this.loc("Number of moves") + ": " + this.numberOfMoves,
            this.loc("Total time") + ": " + (this.currentTime / 1000) + " s"
        ];
    },
    update: function(elapsedMillis) {
       //console.log(elapsedMillis);
    }
},{
});
