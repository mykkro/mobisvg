var player = new SoundPlayer();

var AppsGUI = Base.extend({
    constructor: function() {
        this.apps = {};
        this.settings = {};
        this.translations = {};
    },
    loadTranslations: function(callback) {
      $.getJSON("resources/translations.json").done(callback);
    },
    loadAppList: function(callback) {
        $.getJSON("apps.json").done(callback);
    },
    loadAppsSettings: function(callback) {
        $.getJSON("settings.json").done(callback);
    },
    loadAppsMetadata: function(callback) {
        var self = this;
        self.loadAppList(function(applist) {
            self.loadAppsSettings(function(settings) {
                self.loadTranslations(function(translations) {
                    var urls = applist.map(function(a) { return "apps/"+a+"/app.json"; } );
                    $.getMultipleJSON.apply(this, urls).done(function() {
                        var args = Array.prototype.slice.call(arguments);
                        var apps = {};
                        args.forEach(function(app) {
                            apps[app.name] = app;
                        });
                        self.apps = apps;
                        self.settings = settings;
                        self.translations = translations;
                        callback(self);
                    });
                });
            });
        });
    },
    init: function() {
        var self = this;
        this.loadAppsMetadata(function() {
            console.log("Apps metadata loaded!");
            console.log("Global settings:", self.settings);
            console.log("Apps:",self.apps);
            console.log("Translations:",self.translations);
            self.onReady(self);
        })
    },
    onReady: function(val) {
        if(typeof(val)=="function") {
            this._onReady = val;
        } else {
            if(this._onReady) this._onReady(this, val);
        }
    }
});

/* Game GUI manager. */
var GameGUI = Base.extend({
    constructor: function(url, translations, globalSettings) {
        console.log("Creating Game GUI", url, translations, globalSettings);
        this.url = url;
        this.translations = translations;
        this.globalSettings = globalSettings;
    },
    loadScriptAndStyle: function() {
        var dfd = jQuery.Deferred();
        // load style dynamically...
        $("<link/>", {
           rel: "stylesheet",
           type: "text/css",
           href: this.url + "/style.css"
        }).appendTo("head");
        // load script dynamically
        jQuery.ajax({
            url: this.url + "/script.js",
            dataType: 'script'
        })
        .progress(function(percent, count, total) {
            dfd.notify("Progress: " + percent + "%");
        })
        .fail(function(jqxhr, textStatus, error) {
            dfd.reject(textStatus, error);
        })
        .done(function(scr) {
            dfd.resolve(scr);
        }); 
        return dfd.promise();
    },
    /**
     *  Loads configuration JSON files. Returns Promise. 
     *  Configuration files are:
     *    app.json
     *    globals.json
     *    settings.json 
     *    translations.json
     */
    initialize: function(url) {
        var dfd = jQuery.Deferred();
        var url = this.url;
        jQuery.getMultipleJSON(url + '/globals.json', url + '/app.json',  url + '/settings.json')
        .progress(function(percent, count, total) {
            dfd.notify("Progress: " + percent + "%");
        })
        .fail(function(jqxhr, textStatus, error) {
            dfd.reject(textStatus, error);
        })
        .done(function(globals, game, settings) {
            dfd.resolve(globals, game, settings);
        }); 
        return dfd.promise();
    },
    /**
     * Clears canvas, removes all widgets.
     */
    resetScene: function() {
        if(r) r.clear();
        r = this.makeScene();
    },
    makeScene: function() {
        var paper = Raphael("paper", "100%", "100%");
        paper.setViewBox( 0, 0, 1000, 1000, false );
        var rh = RaphaelHelper;
        if(DEBUG) rh.drawGrid(paper, "#ccc");    
        return paper;
    },
    // show various GUI pages
    showGameLauncherPage: function() {
        r.clear();
        this.showGameTitle();
        this.showGamePreviewImage();
        this.showGameSubtitle();
        this.createGameLauncherButtons();
    },
    showInstructionsPage: function() {
        r.clear();
        this.showGameTitle();
        this.showGameDescription();
        this.showGameInstructions();
        this.showGameSubtitle();
        this.createInstructionsPageButtons();
    },
    showSettingsPage: function() {
        r.clear();
        this.showGameTitle();
        this.createSettingsPageButtons();
        $("#settings-form-outer").show();
    },
    showResultsPage: function(results, messages) {
        r.clear();
        this.showGameTitle();    
        this.showGameResults(results, messages);
        this.createResultsPageButtons();
    },
    showGameSelectionPage: function() {
        r.clear();
    },
    // render various widgets
    showGameResults: function(results, messages) {
        var labelSvg = new TextWidget(600, 40, "middle", this.loc("Results"));
        labelSvg.setPosition(200, 160)
        labelSvg.setStyle({"fill": "black"})

        var yy = 250;    
        messages.forEach(function(m) {
            var msg = new TextWidget(600, 30, "middle", m);
            msg.setPosition(200, yy);
            yy += 40;
        });

    },
    showGameSubtitle: function() {
        var tw = new TextWidget(600, 30, "middle", this.loc("$subtitle"));
        tw.setStyle({"fill": "#ddd"})
        tw.setPosition(200, 130);
    },
    showGameDescription: function() {
        var tw = new TextWidget(800, 20, "start", this.loc("$description"));
        tw.setStyle({"fill": "white"})
        tw.setPosition(100, 200);
    }, 
    showGameInstructions: function() {
        var tw = new TextWidget(800, 25, "start", this.loc("$instructions"));
        tw.setStyle({"fill": "white"})
        tw.setPosition(100, 400);
    },
    showGameTitle: function() {
        var labelSvg = new TextWidget(600, 40, "middle", this.loc("$title"));
        labelSvg.setPosition(200, 60)
        labelSvg.setStyle({"fill": "orange"})
        return labelSvg;
    }, 
    showGamePreviewImage: function() {
        var img = new ImageWidget(this.url + "/preview.png", 500, 500); 
        img.setPosition(250, 200);
        return img;
    },
    // lays out buttons in centered layout
    layoutButtons: function(buttons, gap, y) {
        var totalWidth = 0;
        buttons.forEach(function(b) {
            if(totalWidth) totalWidth += gap;
            totalWidth += b.w;
        });
        xx = (1000-totalWidth)/2;
        buttons.forEach(function(b) {
            b.setPosition(xx, y);
            xx += b.w + gap;
        });
    },
    buttonStyle: {
        fontSize: 30, border: 15, anchor: "middle", radius: 25
    },
    // create buttons
    createGameLauncherButtons: function() {
        var startBtn = new ButtonWidget(this.loc("Start"), this.buttonStyle);        
        var settingsBtn = new ButtonWidget(this.loc("Settings"), this.buttonStyle);        
        var instrBtn = new ButtonWidget(this.loc("Instructions"), this.buttonStyle);        
        var exitBtn = new ButtonWidget(this.loc("Exit"), this.buttonStyle);        
        var gap = 40;
        var yy = 900;
        this.layoutButtons([startBtn, settingsBtn, instrBtn, exitBtn], gap, yy);
        var self = this;

        // bind events
        startBtn.onClick(function() {
            self.startGame();
        });

        settingsBtn.onClick(function() {
            self.showSettingsPage();
        });

        instrBtn.onClick(function() {
            self.showInstructionsPage();
        });

        exitBtn.onClick(function() {
            self.showGameSelectionPage();
        });

        return [startBtn, settingsBtn, instrBtn, exitBtn];
    },
    createInstructionsPageButtons: function() {
        var startBtn = new ButtonWidget(this.loc("Start"), this.buttonStyle);        
        var settingsBtn = new ButtonWidget(this.loc("Settings"), this.buttonStyle);        
        var backBtn = new ButtonWidget(this.loc("Back"), this.buttonStyle);        
        var gap = 40;
        var yy = 900;
        this.layoutButtons([startBtn, settingsBtn, backBtn], gap, yy);
        var self = this;

        // bind events
        startBtn.onClick(function() {
            self.startGame();
        });

        settingsBtn.onClick(function() {
            self.showSettingsPage();
        });

        backBtn.onClick(function() {
            self.showGameLauncherPage();
        });

        return [startBtn, settingsBtn, backBtn];
    },
    createSettingsPageButtons: function() {
        var saveBtn = new ButtonWidget(this.loc("Save"), this.buttonStyle);        
        var resetBtn = new ButtonWidget(this.loc("Reset"), this.buttonStyle);        
        var backBtn = new ButtonWidget(this.loc("Back"), this.buttonStyle);        
        var gap = 40;
        var yy = 900;
        this.layoutButtons([saveBtn, resetBtn, backBtn], gap, yy);
        var self = this;

        // bind events
        saveBtn.onClick(function() {
            self.gameSettings = self.form.val();
            console.log("Game settings: ", self.gameSettings);
            // TODO store globally...
            $("#settings-form-outer").hide();
            self.showGameLauncherPage();
        });

        resetBtn.onClick(function() {
            self.form.val(self.gameSettings);
        });

        backBtn.onClick(function() {
            $("#settings-form-outer").hide();
            self.showGameLauncherPage();
        });

        return [saveBtn, resetBtn, backBtn];
    },
    createResultsPageButtons: function() {
        var againBtn = new ButtonWidget(this.loc("Play again"), this.buttonStyle);        
        var backBtn = new ButtonWidget(this.loc("Back"), this.buttonStyle);        
        var gap = 40;
        var yy = 900;
        this.layoutButtons([againBtn, backBtn], gap, yy);
        var self = this;

        // bind events
        againBtn.onClick(function() {
            self.startGame();
        });

        backBtn.onClick(function() {
            self.showGameLauncherPage();
        });

        return [againBtn, backBtn];
    },
    createAbortButton: function() {
        var abortBtn = new ButtonWidget(this.loc("Exit"), {fontSize: 30, border: 15, anchor: "middle", radius: 20});        
        abortBtn.setPosition(1000-abortBtn.w-10, 10);
        return abortBtn;
    },
    /**
     *  Initializes the game widget abnd starts the game.
    */
    startGame: function() {
        var self = this;
        console.log("Starting the game!");
        var game = new window[this.metadata.gameClass](this.gameSettings);
        game.baseUrl = self.url;
        game.loc = self.loc;
        this.gameInstance = game;
        var sequence = game.generateTaskData();
        this.resetScene();

        game.createGUI(r);                        

        var abortBtn = this.createAbortButton();
        abortBtn.onClick(function() {
            game.abort();
            self.showGameLauncherPage();
        });

        var labelSvg = this.showGameTitle();

        game.onFinish(function(result, messages) {
            console.log("Finished with result:", result);
            self.showResultsPage(result, messages);
        });
        game.onAbort(function() {
            console.log("Aborted!");
            self.showGameLauncherPage();
        });
        game.start(sequence);                        
    },
    // load assets and start the GUI
    start: function() {
        var self = this;
        self.loadScriptAndStyle().done(function() {
            self.initialize().done(function(globals, metadata, settings) {
                self.globals = globals;
                self.metadata = metadata;
                self.settings = $.extend(self.globalSettings, settings);

                console.log("Game initialized!");
                console.log("Globals:", globals);
                console.log("Game:", metadata);
                console.log("Settings:", self.settings);

                var loc = function(name) {
                    if(name) {
                        if(name[0]=="$") {
                            name = name.slice(1);
                            var l = metadata.locales[self.settings.locale];
                            if(name in l) {
                                return l[name];
                            } else {
                                console.warn("Missing ["+self.settings.locale+"] locale for key $" + name)
                                return "$" + name;
                            }
                        } else {
                            var l = self.translations[self.settings.locale];
                            if(name in l) {
                                return l[name];
                            } else {
                                console.warn("Missing ["+self.settings.locale+"] locale for key '" + name + "'")
                                return "{" + name + "}";
                            }
                        }
                    } else {
                        return "";
                    }
                } 

                self.loc = loc;

                // put code here...
                self.resetScene();

                self.game = new window[metadata.gameClass]({});
                self.game.baseUrl = self.url;
                self.game.loc = loc;

                var configForm = {
                    "title": loc("Settings"),
                    "description": "",
                    "fields": metadata.configuration
                }
                self.form = new Form(configForm);
                $("#form").html(self.form.body);
                self.gameSettings = self.form.val();

                console.log("Using settings:", self.gameSettings);

                self.showGameLauncherPage();

            }).fail(function() {
                console.error("Failed to load JSON");
            });
        });        
    }
});
