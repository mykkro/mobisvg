var historyLogger = null;

var AppsGUI = Base.extend({
    constructor: function(db, locale, usertoken) {
        console.log("AppsGUI.constructor", db, locale);
        var localeMap = {
            "en-US": "en",
            "cs-CZ": "cz"
        }
        this.db = db;
        this.locale = "en";
        if(locale in localeMap) {
            this.locale = localeMap[locale];
        }
        this.page = 1;
        this.usertoken = usertoken;
        historyLogger = new HistoryLogger(db, this.locale, usertoken);
    },
    buttonStyle: {
        fontSize: 30, border: 15, anchor: "middle", radius: 25
    },
    loadAppIndex: function(callback) {
        console.log("AppsGUI.loadAppIndex");
        $.getJSON("index.json").done(callback);
    },
    makeConfigForm: function(settings) {
        var settings = settings || {};
        var languages = this.index.index.languages;
        var self = this;
        var languageLabels = languages.map(function(l) { return l.toUpperCase(); });
        var configForm = {
            "title": self.indexLocalized.tr("Settings"),
            "description": "",
            "fields": [
                {
                    "valueLabels": languageLabels,
                    "values": languages,
                    "description": "", 
                    "title": self.indexLocalized.tr("Language"), 
                    "default": settings.language || self.locale, 
                    "type": "string", 
                    "name": "language"
                }
            ]
        }
        self.form = new Form(configForm);
        $("#form").html(self.form.body);
        return self.form;
    },
    loadAppsMetadata: function(callback) {
        var self = this;
        self.loadAppIndex(function(index) {
            var settings = index.settings || {}; 
            if('language' in settings) {
                self.locale = settings['language']
            }         
            console.log("AppsGUI.loadAppsMetadata", index, settings);
            self.index = new Meta(index);
            self.indexLocalized = self.index.localized(self.locale);
            self.makeConfigForm(settings);
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
    showAboutPage: function() {
        this.resetScene();
        /* display SVG About Page */
        if(!AppsGUI.showHTML) {
            this.showCredits();
        } else {
            this.showHtmlAboutPage();
        }
        this.showFrameworkTitle();
        this.createAboutPageButtons();
    },
    showHtmlAboutPage: function() {
        $("#about-form-outer").show();
        var credits = this.indexLocalized.credits;
        AppsGUI.displayCreditsTextHtml(credits);
    },
    hideHtmlAboutPage: function() {
        $("#about-form-outer").hide();
    },
    showFrameworkTitle: function() {
        var labelSvg = new TextWidget(600, 40, "middle", this.indexLocalized.tr("$title"));
        labelSvg.setPosition(200, 60)
        labelSvg.setStyle({"fill": "orange"})
        return labelSvg;
    }, 
    showCredits: function() {
        var credits = this.indexLocalized.credits;
        AppsGUI.displayCreditsText(credits);
    },
    createAboutPageButtons: function() {
        var backBtn = new ButtonWidget(this.indexLocalized.tr("Back"), this.buttonStyle);        
        var gap = 40;
        var yy = 900;
        Widget.layoutButtons([backBtn], gap, yy);
        var self = this;

        backBtn.onClick(function() {
            self.hideHtmlAboutPage();
            self.showAppsPage(1);            
        });

        return [backBtn];
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

        var gap = 10;
        var size = 250;
        var x0 = 115;
        var y0 = 115;
        var ncols = 3;
        if(apps.length <= 6) {
            // use layout 3x2
            y0 = 245;
        }
        if(apps.length <= 4) {
            x0 = 140;
            y0 = 140;
            gap = 20;
            size = 350;
            ncols = 2;
        }
        if(apps.length <= 2) {
            y0 = 310;
        }
        if(apps.length == 1) {
            x0 = 150;
            y0 = 150;
            size = 700;
        }
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
            var x = x0 + (size + gap)*col;
            var y = y0 + (size + gap)*row;
            var translatedTags = instance.app.app.tags.map(function(t) {
                return instance.tr(t);
            });
            var launcher = new AppPreviewWidget(previewUrl, instance.tr("$title"), instance.tr("$subtitle"), translatedTags, size);
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
            if(col == ncols) {
                col = 0;
                row += 1;
                if(row == 3) {
                    break;
                }
            }
        }
    },
    launchApp: function(selectedApp) {
        var self = this;
        console.log("AppsGUI.launchApp", selectedApp);
        this.resetScene();
        var locale = this.locale;
        var appName = selectedApp.name;
        var gamepackName = selectedApp.gamepackName;
        var fullName = appName + ":" + gamepackName;
        var instance = this.index.instance(appName, gamepackName, locale);
        console.log("AppsGUI.launchApp: Start app", instance);
        // TODO do not show "End" button
        var engine = new GameGUI(self, instance, { hideEndButton: true });
        engine.start();
    },
    // create buttons
    createMainPageButtons: function(pg) {
        var self = this;
        var settingsBtn = new ButtonWidget(this.indexLocalized.tr("Settings"), this.buttonStyle);        
        var aboutBtn = new ButtonWidget(this.indexLocalized.tr("About"), this.buttonStyle);        

        /*
        var historyBtn = new ButtonWidget(this.indexLocalized.tr("History"), this.buttonStyle);        
        historyBtn.setEnabled(false);
        historyBtn.onClick(function() {
            self.showHistoryPage();
        });
        */
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
        btns.push(aboutBtn);
        //btns.push(historyBtn);
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

        aboutBtn.onClick(function() {
            self.showAboutPage();
        });

        return [settingsBtn];
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
        console.log("AppsGUI.showAppsPage", pg);
        if(pg.contents.length == 1) {
            // collection contains only one app - show its start page directly...
            this.launchApp(pg.contents[0]);
        } else {
            this.page = pg.page;
            this.showAppLaunchers(pg.contents);
            this.createMainPageButtons(pg);
        }
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
}, {
    showHTML: true,
    parseCredits: function(credits) {
        return credits.map(function(c) {
            // does the line contain formatting metadata?
            var c = c || "";
            var ndx = c.indexOf("@");
            var m = {};
            if(ndx >= 0) {
                // separate the string into two...
                var meta = c.substring(0,ndx);
                var parts = meta.trim().split(",");
                parts.forEach(function(p) {
                    var pp = p.split("=");
                    var key = pp[0];
                    var val = pp[1];
                    m[key] = val;
                });
                console.log("META", m);
                // metadata is sequence of aa=bb,cc=dd 
                c = c.substring(ndx+1);
            }
            m.fontSize = parseInt(m.fontSize || 20);
            return { "line": c, "style": m }
        });
    },
    displayCreditsText: function(credits) {
        var credits = credits || [];
        console.log("Credits:", credits);
        var yy = 200;
        var pc = AppsGUI.parseCredits(credits);
        console.log(pc);
        pc.forEach(function(ppc) {
            var c = ppc.line;
            var fontSize = ppc.fontSize || 20;
            var lineHeight = Math.floor(fontSize*1.5);
            var tw = new TextWidget(800, fontSize, "start", c);
            tw.setStyle({"fill": "white"})
            tw.setPosition(100, yy);        
            yy += Math.floor(Math.max(tw.getTextboxSize().height, fontSize) + lineHeight - fontSize);
        });
    },
    parseLinks: function(line) {
        var c = line;
        var arr = [];
        var curr = {"type":"text", "content":""};
        arr.push(curr);
        var state = "TEXT";
        for(var i=0; i<c.length; i++) {
            var cc = c[i];
            if(state=="TEXT") {
                if(cc != "<") {
                    curr.content += cc;
                } else {
                    // switch to link
                    curr = {"type":"link", "content":"", "title": ""};
                    arr.push(curr);
                    state = "LINK";
                }
            } else if(state=="LINK") {
                if(cc == "|") {
                    state = "LINKTITLE";
                } else if(cc != ">") {
                    curr.content += cc;
                } else {
                    // switch back to text
                    curr = {"type":"text", "content":""};
                    arr.push(curr);
                    state = "TEXT";
                }
            } else if(state=="LINKTITLE") {
                if(cc != ">") {
                    curr.title += cc;
                } else {
                    // switch back to text
                    curr = {"type":"text", "content":""};
                    arr.push(curr);
                    state = "TEXT";
                }
            } else {
                console.error("Unsupported state: ", state)
            }
        }
        arr = arr.filter(function(a) { return a.content; });
        return arr;
    },
    // TODO correct resizing 
    // maybe by css3 transform/zoom?
    displayCreditsTextHtml: function(credits) {
        var credits = credits || [];
        console.log("Credits:", credits);
        var pc = AppsGUI.parseCredits(credits);
        console.log(pc);
        var out = $("#about-form");
        var coeff = ($("#about-form-outer").width()/218.0)*0.3;
        out.empty();
        pc.forEach(function(ppc) {
            var c = ppc.line;
            var fontSize = ppc.style.fontSize;
            var lineHeight = Math.floor(fontSize*1.5);
            var arr = AppsGUI.parseLinks(c);
            var div = $("<div>").addClass("credits-line");
            console.log("ARR", arr);
            arr.forEach(function(a) {
                if(a.type == "link") {
                    var o = $("<a>").attr("href", a.content).attr("target", "_blank").text(a.title || a.content);
                    div.append(o);
                } else if(a.type == "text") {
                    var o = $("<span>").text(a.content);
                    div.append(o);
                }
            });
            var fs = (fontSize * coeff);
            var lh = (lineHeight * coeff);
            div.css("font-size", fs+"px");
            div.css("line-height", lh+"px");
            div.css("margin-bottom", (fs*0.8)+"px")
            out.append(div);
            console.log(c);
        });
    }
});
