
var AppsGUI = Base.extend({
    constructor: function() {
        console.log("AppsGUI.constructor");
        this.locale = "cz";
        this.page = 1;
    },
    buttonStyle: {
        fontSize: 30, border: 15, anchor: "middle", radius: 25
    },
    loadAppIndex: function(callback) {
        console.log("AppsGUI.loadAppIndex");
        $.getJSON("index.json").done(callback);
    },
    makeConfigForm: function() {
        var self = this;
        var configForm = {
            "title": self.indexLocalized.tr("Settings"),
            "description": "",
            "fields": [
                {
                    "valueLabels": [
                        "EN", 
                        "CZ"
                    ], 
                    "values": [
                        "en", 
                        "cz"
                    ], 
                    "description": "", 
                    "title": self.indexLocalized.tr("Language"), 
                    "default": "en", 
                    "type": "string", 
                    "name": "language"
                }, 
            ]
        }
        self.form = new Form(configForm);
        $("#form").html(self.form.body);
        return self.form;
    },
    loadAppsMetadata: function(callback) {
        var self = this;
        self.loadAppIndex(function(index) {
            console.log("AppsGUI.loadAppsMetadata", index);
            self.index = new Meta(index);
            self.indexLocalized = self.index.localized(self.locale);
            self.makeConfigForm();
            self.appSettings = self.form.val();
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
    getSortedAppList: function(page) {
        var all = this.index.appsByLocale(this.locale);
        var pages = Math.floor((all.length+8)/9);
        var out = [];
        for(var i=((page-1)*9); i<page*9; i++) {
            if(i<all.length) {
                out.push(all[i]);
            }
        }
        return { pages: pages, page: page, contents: out };
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
    showSettingsPage: function() {
        this.resetScene();
        this.createSettingsPageButtons();
        $("#settings-form-outer").show();
    },
    createSettingsPageButtons: function() {
        var saveBtn = new ButtonWidget(this.indexLocalized.tr("Save"), this.buttonStyle);        
        var resetBtn = new ButtonWidget(this.indexLocalized.tr("Reset"), this.buttonStyle);        
        var backBtn = new ButtonWidget(this.indexLocalized.tr("Back"), this.buttonStyle);        
        var gap = 40;
        var yy = 900;
        Widget.layoutButtons([saveBtn, resetBtn, backBtn], gap, yy);
        var self = this;

        // bind events
        saveBtn.onClick(function() {
            self.appSettings = self.form.val();
            console.log("App settings: ", self.appSettings);
            $("#settings-form-outer").hide();
            self.applySettings(self.appSettings);
        });

        resetBtn.onClick(function() {
            self.form.val(self.appSettings);
        });

        backBtn.onClick(function() {
            $("#settings-form-outer").hide();
            self.showAppsPage(1);
        });

        return [saveBtn, resetBtn, backBtn];
    },
    applySettings: function(settings) {
        console.log("AppsGUI.applySettings", settings);
        var self = this;
        if(settings.language != this.locale) {
            this.locale = settings.language;
            this.page = 1;
            self.indexLocalized = self.index.localized(self.locale);
        }
        this.showMainPage();
    },
    showAppLaunchers: function(apps) {
        var self = this;
        console.log("AppsGUI.showAppLaunchers", apps);
        this.resetScene();
        // display up to 9 launchers
        // each launcher is 250x250 px
        var row = 0;
        var col = 0;
        var i = 0;
        var locale = this.locale;
        while(i<apps.length) {
            var appName = apps[i].name;
            var gamepackName = apps[i].gamepackName;
            var fullName = appName + ":" + gamepackName;
            var app = this.index.app(fullName);
            i++;
            var instance = this.index.instance(appName, gamepackName, locale);
            var previewUrl = instance.appBaseUrl + "/"+ instance.res("preview");
            console.log("Game launcher instance:", instance);            
            // create launcher and position it...
            console.log("Creating launcher for app", app, row, col);
            var gap = 10;
            var x = 115 + (250 + gap)*col;
            var y = 115 + (250 + gap)*row;
            var translatedTags = instance.app.app.tags.map(function(t) {
                return instance.tr(t);
            });
            var launcher = new AppPreviewWidget(previewUrl, instance.tr("$title"), instance.tr("$subtitle"), translatedTags);
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
    createMainPageButtons: function(pg) {
        var self = this;
        var settingsBtn = new ButtonWidget(this.indexLocalized.tr("Settings"), this.buttonStyle);        
        var historyBtn = new ButtonWidget(this.indexLocalized.tr("History"), this.buttonStyle);        
        /**/historyBtn.setEnabled(false);/**/    
        var prevBtn, bextBtn;
        var btns = [];
        if(pg.page>1) {
            prevBtn = new ButtonWidget(this.indexLocalized.tr("Previous"), this.buttonStyle);        
            btns.push(prevBtn);
            prevBtn.onClick(function() {
                self.showAppsPage(pg.page-1);
            });
        }
        btns.push(settingsBtn);
        btns.push(historyBtn);
        if(pg.page<pg.pages) {
            nextBtn = new ButtonWidget(this.indexLocalized.tr("Next"), this.buttonStyle);        
            btns.push(nextBtn);
            nextBtn.onClick(function() {
                self.showAppsPage(pg.page+1);
            });
        }
        var gap = 40;
        var yy = 900;
        Widget.layoutButtons(btns, gap, yy);

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
        var self = this;
        self.makeConfigForm();
        self.form.val(self.appSettings);
        this.showAppsPage(this.page);
    },
    showAppsPage: function(page) {
        var page = page || 1;
        var pg = this.getSortedAppList(page);
        this.page = pg.page;
        this.showAppLaunchers(pg.contents);
        this.createMainPageButtons(pg);
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
