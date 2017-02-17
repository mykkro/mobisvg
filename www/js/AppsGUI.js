
var AppsGUI = Base.extend({
    constructor: function() {
        console.log("AppsGUI.constructor");
        this.locale = "en";
    },
    buttonStyle: {
        fontSize: 30, border: 15, anchor: "middle", radius: 25
    },
    loadAppIndex: function(callback) {
        console.log("AppsGUI.loadAppIndex");
        $.getJSON("index.json").done(callback);
    },
    loadAppsMetadata: function(callback) {
        var self = this;
        self.loadAppIndex(function(index) {
            console.log("AppsGUI.loadAppsMetadata", index);
            self.index = new Meta(index);
            self.indexLocalized = self.index.localized(self.locale);
            callback(self);
        });
    },
    init: function() {
        var self = this;
        console.log("AppsGUI.init");
        this.loadAppsMetadata(function() {
            console.log("Apps index loaded!", self.index);
            self.onReady(self);
        })
    },
    onReady: function(val) {
        if(typeof(val)=="function") {
            this._onReady = val;
        } else {
            if(this._onReady) this._onReady(this, val);
        }
    },
    getSortedAppList: function() {
        return this.index.appsByLocale(this.locale);
    },
    getAllTags: function() {
        var tagMap = {};
        for(var key in this.apps) {
            var app = this.apps[key];
            app.tags.forEach(function(t) { tagMap[t] = true; });
        }
        var tags = [];
        for(var key in tagMap) {
            tags.push(this.loc(key));
        }
        tags.sort();
        return tags;
    },
    showAppLaunchers: function(apps) {
        var self = this;
        console.log(apps);
        this.resetScene();
        // display up to 9 launchers
        // each launcher is 250x250 px
        var row = 0;
        var col = 0;
        var i = 0;
        var locale = this.locale;
        while(i<apps.length) {
            var appName = apps[i++];
            var app = this.index.app(appName);
            var gamepack = app.defaultGamepack()
            var gamepackName = gamepack.name;
            var instance = this.index.instance(appName, gamepackName, locale);
            var previewUrl = instance.appBaseUrl + "/"+ instance.res("preview");
            console.log("Game launcher instance:", instance);            
            // create launcher and position it...
            console.log("Creating launcher for app", app, row, col);
            var gap = 10;
            var x = 115 + (250 + gap)*col;
            var y = 115 + (250 + gap)*row;
            var launcher = new AppPreviewWidget(previewUrl, instance.tr("$title"), instance.tr("$subtitle"), instance.app.app.tags);
            launcher.setPosition(x, y);
            (function() {
                var app2 = instance;
                launcher.onClick(function() {
                    console.log("Start app", app2);
                    engine = new GameGUI(self, app2);
                    engine.start();
                })
            })();
            col += 1;
            if(col == 3) {
                col = 0;
                row += 1;
                if(row == 3) {
                    break;
                }
            }
        }
    },
    // create buttons
    createMainPageButtons: function() {
        var settingsBtn = new ButtonWidget(this.indexLocalized.tr("Settings"), this.buttonStyle);        
        var historyBtn = new ButtonWidget(this.indexLocalized.tr("History"), this.buttonStyle);        
        var gap = 40;
        var yy = 900;
        Widget.layoutButtons([settingsBtn, historyBtn], gap, yy);
        var self = this;

        // bind events
        settingsBtn.onClick(function() {
            self.showSettingsPage();
        });

        historyBtn.onClick(function() {
            self.showHistoryPage();
        });

        return [settingsBtn, historyBtn];
    },
    showMainPage: function() {
        this.showAppLaunchers(this.getSortedAppList());
        this.createMainPageButtons();
    },
    /**
     * Clears canvas, removes all widgets.
     */
    resetScene: function() {
        if(r) {
            // clear paper contents
            r.clear();
            // remove from DOM
            r.canvas.remove();            
            r = null;
        }
        r = this.makeScene();
    },
    makeScene: function() {
        var paper = Raphael("paper", "100%", "100%");
        paper.setViewBox( 0, 0, 1000, 1000, false );
        var rh = RaphaelHelper;
        if(DEBUG) rh.drawGrid(paper, "#ccc");    
        return paper;
    }
});
