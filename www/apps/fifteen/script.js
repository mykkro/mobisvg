var Fifteen = TimedGame.extend({

	constructor: function(config) {
        this.base(config);
	},

	renderBoard: function() {
	    console.log("Fifteen.renderBoard")

/*
				var ttt = new MahjonggTileWidget(self, tile.type, tile.index, pos.x, pos.y, pos.z);
				var clk = ttt.clickable;
				clk.onClick(function() {
					self.onTileClicked(ttt, tile, pos);
				})
				*/
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
            this.loc("Total time") + ": " + (this.currentTime / 1000) + " s"
        ];
    },
    update: function(elapsedMillis) {
        console.log(elapsedMillis);
    }
},{
});
