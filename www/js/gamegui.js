
/* Game GUI manager. */
var GameGUI = Base.extend({
    constructor: function(appgui, instance, options) {
        console.log("Creating Game GUI", instance);
        this.appgui = appgui;
        this.instance = instance;
        this.url = instance.appBaseUrl;
        this.options = options || {};
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
    showAboutPage: function() {
        r.clear();
        this.showGameTitle();
        this.showCredits();
        this.createAboutPageButtons();
    },
    showCredits: function() {
        var credits = this.instance.credits;
        var creditsText = credits.join("\n");
        console.log("Credits:", creditsText);
        var tw = new TextWidget(800, 20, "start", creditsText);
        tw.setStyle({"fill": "white"})
        tw.setPosition(100, 200);        
    },    
    createAboutPageButtons: function() {
        var backBtn = new ButtonWidget(this.instance.tr("Back"), this.buttonStyle);        
        var gap = 40;
        var yy = 900;
        Widget.layoutButtons([backBtn], gap, yy);
        var self = this;

        backBtn.onClick(function() {
            self.showGameLauncherPage();
        });

        return [backBtn];
    },
    showResultsPage: function(results, messages) {
        r.clear();
        this.showGameTitle();    
        this.showGameResults(results, messages);
        this.createResultsPageButtons();
    },
    showGameSelectionPage: function() {
        this.appgui.showMainPage();
    },
    // render various widgets
    showGameResults: function(results, messages) {
        var labelSvg = new TextWidget(600, 40, "middle", this.instance.tr("Results"));
        labelSvg.setPosition(200, 160)
        labelSvg.setStyle({"fill": "black"})

        var yy = 250;    
        messages.forEach(function(m) {
            // m can be object!
            var textItems = [];
            if(m.text || m.items) {
                if(m.text) {
                    textItems.push(m);
                } else {
                    textItems = m.items;
                }
            } else {
                textItems.push({text: m});
            }
            textItems.forEach(function(ti) {
                var x = ti.x || 0;
                var fontSize = ti.fontSize || 30;
                var textAnchor = ti.textAnchor || "middle";
                var msg = new TextWidget(600, fontSize, textAnchor, ti.text);
                msg.setPosition(200+x, yy);
            })
            yy += 40;
        });

    },
    showGameSubtitle: function() {
        var tw = new TextWidget(600, 30, "middle", this.instance.tr("$subtitle"));
        tw.setStyle({"fill": "#ddd"})
        tw.setPosition(200, 130);
    },
    showGameDescription: function() {
        var tw = new TextWidget(800, 20, "start", this.instance.tr("$description"));
        tw.setStyle({"fill": "white"})
        tw.setPosition(100, 200);
    }, 
    showGameInstructions: function() {
        var tw = new TextWidget(800, 25, "start", this.instance.tr("$instructions"));
        tw.setStyle({"fill": "white"})
        tw.setPosition(100, 400);
    },
    showGameTitle: function() {
        var labelSvg = new TextWidget(600, 40, "middle", this.instance.tr("$title"));
        labelSvg.setPosition(200, 60)
        labelSvg.setStyle({"fill": "orange"})
        return labelSvg;
    }, 
    showGamePreviewImage: function() {
        var self = this;
        var previewUrl = this.instance.appBaseUrl + "/"+ this.instance.res("preview");
        var img = new ImageWidget(previewUrl, 500, 500); 
        img.setPosition(250, 200);
        var clk = new Clickable(img);
        clk.onClick(function() {
            self.startGame();
        });
        return clk;
    },
    // lays out buttons in centered layout
    buttonStyle: {
        fontSize: 30, border: 15, anchor: "middle", radius: 25
    },
    // create buttons
    createGameLauncherButtons: function() {
        var self = this;
        var startBtn = new ButtonWidget(this.instance.tr("Start"), this.buttonStyle);        
        var settingsBtn = null;
        var instrBtn = new ButtonWidget(this.instance.tr("Instructions"), this.buttonStyle);    
        var exitBtn = null;
        if(!(this.options.hideEndButton)) {
            exitBtn = new ButtonWidget(this.instance.tr("Exit"), this.buttonStyle);        
            exitBtn.onClick(function() {
                self.showGameSelectionPage();
            });
        }
        /*
        var historyBtn = new ButtonWidget(this.instance.tr("History"), this.buttonStyle);    
        historyBtn.setEnabled(false);
        historyBtn.onClick(function() {
            self.showHistoryPage();
        });
        */

        var aboutBtn = new ButtonWidget(this.instance.tr("About"), this.buttonStyle);    
        aboutBtn.setEnabled(true);
        aboutBtn.onClick(function() {
            self.showAboutPage();
        });

        
        var configFields = this.instance.config || [];
        console.log("Config fields:", configFields);
        if(configFields.length > 0) {
            settingsBtn = new ButtonWidget(this.instance.tr("Settings"), this.buttonStyle);        
            settingsBtn.onClick(function() {
                self.showSettingsPage();
            });
        }

        var gap = 40;
        var yy = 900;
        var btns = [];
        btns.push(startBtn);
        if(settingsBtn) {
            btns.push(settingsBtn);
        }
        btns.push(instrBtn);
        btns.push(aboutBtn);
        if(exitBtn) {
            btns.push(exitBtn);
        }
        Widget.layoutButtons(btns, gap, yy);

        // bind events
        startBtn.onClick(function() {
            self.startGame();
        });


        instrBtn.onClick(function() {
            self.showInstructionsPage();
        });

        return btns;
    },
    createInstructionsPageButtons: function() {
        var backBtn = new ButtonWidget(this.instance.tr("Back"), this.buttonStyle);        
        var gap = 40;
        var yy = 900;
        Widget.layoutButtons([backBtn], gap, yy);
        var self = this;

        // bind events
        backBtn.onClick(function() {
            self.showGameLauncherPage();
        });

        return [backBtn];
    },
    createSettingsPageButtons: function() {
        var saveBtn = new ButtonWidget(this.instance.tr("Save"), this.buttonStyle);        
        var resetBtn = new ButtonWidget(this.instance.tr("Reset"), this.buttonStyle);        
        var backBtn = new ButtonWidget(this.instance.tr("Back"), this.buttonStyle);        
        var gap = 40;
        var yy = 900;
        Widget.layoutButtons([saveBtn, resetBtn, backBtn], gap, yy);
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
        var againBtn = new ButtonWidget(this.instance.tr("Run again"), this.buttonStyle);        
        var backBtn = new ButtonWidget(this.instance.tr("Back"), this.buttonStyle);        
        var gap = 40;
        var yy = 900;
        Widget.layoutButtons([againBtn, backBtn], gap, yy);
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
        var abortBtn = new ButtonWidget(this.instance.tr("Exit"), {fontSize: 30, border: 15, anchor: "middle", radius: 20});        
        abortBtn.setPosition(1000-abortBtn.w-10, 10);
        return abortBtn;
    },
    /**
     *  Initializes the game widget abnd starts the game.
    */
    startGame: function() {
        var self = this;
        console.log("Starting the game!");
        var game = new window[self.instance.app.app.gameClass](this.gameSettings);
        game.baseUrl = self.url;
        game.meta = self.instance;
        game.loc = function(str) {
            return self.instance.tr(str);
        };
        this.gameInstance = game;
        var sequence = game.generateTaskData();
        this.appgui.resetScene();

        game.createGUI(r);                        

        var eo = game.embeddingOptions;
        console.log("Embedding options:", eo);

        if(eo.renderTitle) {
            var labelSvg = this.showGameTitle();
        }
        if(eo.renderAbortButton) {
            var abortBtn = this.createAbortButton();
            abortBtn.onClick(function() {
                game.abort();
                self.showGameLauncherPage();
            });
        }

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
    start: function() {
        var self = this;
        self.loadScriptAndStyle().done(function() {
            console.log("GameGUI.start - script and style loaded!")
            console.log(self.instance);
            self.settings = self.instance.settings;

            // put code here...
            self.appgui.resetScene();

            self.game = new window[self.instance.app.app.gameClass]({});
            self.game.baseUrl = self.url;

            var configForm = {
                "title": self.instance.tr("Settings"),
                "description": "",
                "fields": self.instance.config
            }
            self.form = new Form(configForm, function(loc) { return self.instance.tr(loc); });
            $("#form").html(self.form.body);
            self.gameSettings = self.form.val();

            console.log("Using settings:", self.gameSettings);

            self.showGameLauncherPage();

        });        
    }
});
