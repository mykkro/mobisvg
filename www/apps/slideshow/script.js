


var Slideshow = Game.extend({
    constructor: function(config) {
        this.base(config);
    },
    createGUI: function(r) {
        var self = this;
    },
    generateTaskData: function(options) {
        return null;
    },            
    renderFrame: function() {
        var self = this;
    },
    loadGamepack: function(name) {
        var self = this;
        var dfd = jQuery.Deferred();
        var gamepackUrl = self.baseUrl + "/gamepacks/" + name;
        var tilesetUrl = gamepackUrl + "/slideshow.json";
        $.getJSON(tilesetUrl).done(function(slideshow) {
            console.log("Slideshow data loaded:", slideshow);
            // call resolve when it is done
            dfd.resolve({name:name, url:gamepackUrl, slideshow:slideshow});
        });
        return dfd.promise();
    },
    start: function(gamedata) {
        this.base(gamedata);
        var self = this;
        console.log("Slideshow:start");

        // choose a gamepack
        var gamepackName = "body1";
        self.loadGamepack(gamepackName).done(function(gamepack) {
            console.log("Gamepack loaded", gamepack);
            self.gamepack = gamepack;
            self.task = new NullTask();
            self.renderFrame();
        });


    }
},{
});
