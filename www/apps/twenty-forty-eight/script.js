// 2048 game
// https://github.com/joelrojo/2048

var Game2048 = function(boardString='0000000000000000') {
  this.board = generateNewBoard(boardString);
  this.moves = 0;
  this.score = 0;

  this.toArray = function() {
    array = this.board[0].join(",") + "," + this.board[1].join(",") + "," + this.board[2].join(",") + "," + this.board[3].join(",");
    return array.split(",");
  }

  this.toString = function() {
    return this.board[0].join('') + "\n" + this.board[1].join('') + "\n" + this.board[2].join('') + "\n" + this.board[3].join('');
  }

  this.move = function(direction) {
    switch (direction) {
      case "up":
        var resolved = resolveColUp(this.board)
        this.board = resolved['board'];
        this.score += resolved['score'];
        break;

      case "down":
        var resolved = resolveColDown(this.board)
        this.board = resolved['board'];
        this.score += resolved['score'];
        break;

      case "left":
        var resolved = resolveRowLeft(this.board)
        this.board = resolved['board'];
        this.score += resolved['score'];
        break;

      case "right":
        var resolved = resolveRowRight(this.board)
        this.board = resolved['board'];
        this.score += resolved['score'];
        break;
    }
    this.board = spawnBlock(this.board)
    this.moves++;
  }
};


function spawnBlock(board, numBlocks=1) {
	var freeblocks = [];
	for(var i=0; i<16; i++) {
		var rr = Math.floor(i/4);
		var cc = i%4;
		if(board[rr][cc] === 0) {
			freeblocks.push([rr, cc]);
		}
	}
	if(freeblocks.length == 0) {
		throw "No more moves!";
	}
  var count = 0;
  while (count < numBlocks) {
    row = Math.floor(Math.random() * 4);
    col = Math.floor(Math.random() * 4);
    if (board[row][col] === 0) {
      board[row][col] = 2;
      count++;
    }
  }
  return board;
}

function generateNewBoard(boardString) {
  var board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  if (boardString != "0000000000000000" && /^[02]+$/.test(boardString) && boardString.length == 16) {
    var count = 0;
    for(var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        board[x][y] = parseInt(boardString[count]);
        count++;
      }
    }
  } else if (boardString instanceof Array) {
    board[0] = boardString.slice(0,4);
    board[1] = boardString.slice(4,8)
    board[2] = boardString.slice(8,12);
    board[3] = boardString.slice(12,16);
    
  } else {
    board = spawnBlock(board, 2);
  }
  return board;
}

function resolveColUp(board) {
  var score = 0;
  for (var col = 0; col < board.length; col++) { // run for each column
    for (var j = 0; j < 3; j++) { // run each column 3 times
      for (var i = 0; i < 3; i++) { // iterate through column
        if (board[i][col] == 0) {
          board[i][col] = board[i][col] + board[i + 1][col];
          board[i + 1][col] = 0;
        } else if (board[i][col] == board[i + 1][col] && board[i][col] != 0) {
          board[i][col] = board[i][col] + board[i + 1][col];
          board[i + 1][col] = 0;
          j++;
          score += parseInt(board[i][col]);
        }
      }
    }
  }
  var resolved = { 'board': board, 'score': score }
  return resolved;
}

function resolveColDown(board) {
  var score = 0;
  for (var col = 0; col < board.length; col++) {
    for (var j = 0; j < 3; j++) { // 3 times per column
      for (var i = 3; i > 0; i--) { //iterate through column from bottom up
        if (board[i][col] == 0) {
          board[i][col] = board[i][col] + board[i - 1][col];
          board[i - 1][col] = 0;
        } else if (board[i][col] == board[i - 1][col] && board[i][col] != 0) {
          board[i][col] = board[i][col] + board[i - 1][col];
          board[i - 1][col] = 0;
          j++;
          score += parseInt(board[i][col]);
        }
      }
    }
  }
  var resolved = { 'board': board, 'score': score }
  return resolved;
}

function resolveRowLeft(board) {
  var score = 0;
  for (var row = 0; row < board.length; row++) {
    for (var j = 0; j < 3; j++) {
      for (var i = 0; i < 3; i++) {
        if (board[row][i] == 0) {
          board[row][i] = board[row][i] + board[row][i + 1];
          board[row][i + 1] = 0;
        } else if (board[row][i] == board[row][i + 1] && board[row][i] != 0) {
          board[row][i] = board[row][i] + board[row][i + 1];
          board[row][i + 1] = 0;
          j++;
          score += parseInt(board[row][i]);
        }
      }
    }
  }
  var resolved = { 'board': board, 'score': score }
  return resolved;
}

function resolveRowRight(board) {
  var score = 0;
  for (var row = 0; row < board.length; row++) {
    for (var j = 0; j < 3; j++) {
      for (var i = 3; i > 0; i--) {
        if (board[row][i] == 0) {
          board[row][i] = board[row][i] + board[row][i - 1];
          board[row][i - 1] = 0;
        } else if (board[row][i] == board[row][i - 1] && board[row][i] != 0) {
          board[row][i] = board[row][i] + board[row][i - 1];
          board[row][i - 1] = 0;
          j++;
          score += parseInt(board[row][i]);
        }
      }
    }
  }
  var resolved = { 'board': board, 'score': score }
  return resolved;
}
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
