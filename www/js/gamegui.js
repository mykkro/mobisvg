
// lays out buttons in centered layout
var layoutButtons = function(buttons, gap, y) {
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
}

var buttonStyle = {fontSize: 30, border: 15, anchor: "middle", radius: 25};

var createGameLauncherButtons = function(loc, metadata, gameSettings) {
    var startBtn = new ButtonWidget(loc("Start"), buttonStyle);        
    var settingsBtn = new ButtonWidget(loc("Settings"), buttonStyle);        
    var instrBtn = new ButtonWidget(loc("Instructions"), buttonStyle);        
    var exitBtn = new ButtonWidget(loc("Exit"), buttonStyle);        
    var gap = 40;
    var yy = 800;
    layoutButtons([startBtn, settingsBtn, instrBtn, exitBtn], gap, yy);

    // bind events
    startBtn.onClick(function() {
        startGame(loc, metadata, gameSettings);
    });

    settingsBtn.onClick(function() {
        showSettingsPage(loc, metadata, gameSettings);
    });

    instrBtn.onClick(function() {
        showInstructionsPage(loc, metadata, gameSettings);
    });

    exitBtn.onClick(function() {
        showGameSelectionPage(loc);
    });

    return [startBtn, settingsBtn, instrBtn, exitBtn];
}

var createInstructionsPageButtons = function(loc, metadata, gameSettings) {
    var startBtn = new ButtonWidget(loc("Start"), buttonStyle);        
    var settingsBtn = new ButtonWidget(loc("Settings"), buttonStyle);        
    var backBtn = new ButtonWidget(loc("Back"), buttonStyle);        
    var gap = 40;
    var yy = 800;
    layoutButtons([startBtn, settingsBtn, backBtn], gap, yy);

    // bind events
    startBtn.onClick(function() {
        startGame(loc, metadata, gameSettings);
    });

    settingsBtn.onClick(function() {
        showSettingsPage(loc, metadata, gameSettings);
    });

    backBtn.onClick(function() {
        showGameLauncherPage(loc, metadata, gameSettings);
    });

    return [startBtn, settingsBtn, backBtn];
}

var createSettingsPageButtons = function(loc, metadata, gameSettings) {
    var saveBtn = new ButtonWidget(loc("Save"), buttonStyle);        
    var resetBtn = new ButtonWidget(loc("Reset"), buttonStyle);        
    var backBtn = new ButtonWidget(loc("Back"), buttonStyle);        
    var gap = 40;
    var yy = 800;
    layoutButtons([saveBtn, resetBtn, backBtn], gap, yy);

    // bind events
    saveBtn.onClick(function() {
        alert("saving settings...");
        showGameLauncherPage(loc, metadata, gameSettings);
    });

    resetBtn.onClick(function() {
        alert("resetting settings...");
    });

    backBtn.onClick(function() {
        showGameLauncherPage(loc, metadata, gameSettings);
    });

    return [saveBtn, resetBtn, backBtn];
}

var createResultsPageButtons = function(loc, metadata, gameSettings) {
    var againBtn = new ButtonWidget(loc("Play again"), buttonStyle);        
    var backBtn = new ButtonWidget(loc("Back"), buttonStyle);        
    var gap = 40;
    var yy = 800;
    layoutButtons([againBtn, backBtn], gap, yy);

    // bind events
    againBtn.onClick(function() {
        startGame(loc, metadata, gameSettings);
    });

    backBtn.onClick(function() {
        showGameLauncherPage(loc, metadata, gameSettings);
    });

    return [againBtn, backBtn];
}
var createAbortButton = function(loc) {
    var abortBtn = new ButtonWidget(loc("Exit"), {fontSize: 30, border: 15, anchor: "middle", radius: 20});        
    abortBtn.setPosition(1000-abortBtn.w-10, 10);
    return abortBtn;
}

var showGameSelectionPage = function(loc) {
    r.clear();
}


var showGameLauncherPage = function(loc, metadata, gameSettings) {
    r.clear();
    showGameTitle(loc);
    showGamePreviewImage();
    showGameSubtitle(loc);
    createGameLauncherButtons(loc, metadata, gameSettings);
}

var showInstructionsPage = function(loc, metadata, gameSettings) {
    r.clear();
    showGameTitle(loc);
    showGameDescription(loc);
    showGameInstructions(loc);
    showGameSubtitle(loc);
    createInstructionsPageButtons(loc, metadata, gameSettings);
}

var showSettingsPage = function(loc, metadata, gameSettings) {
    r.clear();
    showGameTitle(loc);
    createSettingsPageButtons(loc, metadata, gameSettings);
}

var showResultsPage = function(loc, metadata, gameSettings, results) {
    r.clear();
    showGameTitle(loc);    
    showGameResults(loc, results);
    createResultsPageButtons(loc, metadata, gameSettings);
}

var showGameResults = function(loc, results) {
    var labelSvg = new TextWidget(600, 40, "middle", loc("Results"));
    labelSvg.setPosition(200, 160)
    labelSvg.setStyle({"fill": "black"})

    var yy = 250;    
    results.messages.forEach(function(m) {
        var msg = new TextWidget(600, 30, "middle", m);
        msg.setPosition(200, yy);
        yy += 40;
    });

}

var showGameSubtitle = function(loc) {
    var tw = new TextWidget(600, 30, "middle", loc("subtitle"));
    tw.setStyle({"fill": "cyan"})
    tw.setPosition(200, 130);
} 

var showGameDescription = function(loc) {
    var tw = new TextWidget(800, 20, "start", loc("description"));
    tw.setStyle({"fill": "cyan"})
    tw.setPosition(100, 200);
} 

var showGameInstructions = function(loc) {
    var tw = new TextWidget(800, 25, "start", loc("instructions"));
    tw.setStyle({"fill": "cyan"})
    tw.setPosition(100, 300);
} 

var showGameTitle = function(loc) {
    var labelSvg = new TextWidget(600, 40, "middle", loc("title"));
    labelSvg.setPosition(200, 60)
    labelSvg.setStyle({"fill": "blue"})
    return labelSvg;
}

var showGamePreviewImage = function() {
    var img = new ImageWidget(gameBaseUrl + "/preview.png", 500, 500); 
    img.setPosition(250, 200);
    return img;
}

var startGame = function(loc, metadata, gameSettings) {
    console.log("Starting the game!");
    var game = new window[metadata.gameClass](gameSettings);
    var sequence = game.generateTaskData();
    resetScene();

    game.createGUI(r);                        

    var abortBtn = createAbortButton(loc);
    abortBtn.onClick(function() {
        game.abort();
        showGameLauncherPage(loc, metadata, gameSettings);
    });

    var labelSvg = showGameTitle(loc);

    game.onFinish(function(result, messages) {
        console.log("Finished with result:", result);
        showResultsPage(loc, metadata, gameSettings, {result:result, messages:messages});
    });
    game.onAbort(function() {
        console.log("Aborted!");
        showGameLauncherPage(loc, metadata, gameSettings);
    });
    game.start(sequence);                        
}

/*
    $("#result-wrap").click(function() {
        // back to title...
        $("#gamebox-overlay").hide();
        $("#gamebox").hide();
        $("#info").show();
    });

    $("#info button[name=game-settings]").click(function() {
        console.log("Configuring the game!");
        form.val(gameSettings);
        $("#info").hide();
        $("#form-wrapper").show();
    });

    $("#form-wrapper button[name=form-save]").click(function() {
        console.log("Saving the settings!");
        gameSettings = form.val();
        $("#form-wrapper").hide();
        $("#info").show();
    });

    $("#form-wrapper button[name=form-cancel]").click(function() {
        console.log("Discarding the settings!");
        $("#form-wrapper").hide();
        $("#info").show();
    });

    $("#form-wrapper").hide();
    $("#info").show();
    $("#gamebox").hide();
*/


var gameBaseUrl = "apps/differences";
//var gameBaseUrl = "apps/pick-twenty";

var initialize = function(url) {
    var dfd = jQuery.Deferred();
 
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

    // Return the Promise so caller can't change the Deferred
    return dfd.promise();
}

/**
 * Clears canvas, removes all widgets.
 */
var resetScene = function() {
    $("#holder").empty();
    $("#html-widgets").empty();
    if(r) r.clear();
    r = makeScene();
}

var makeScene = function() {
    var paper = Raphael("paper", "100%", "100%");
    paper.setViewBox( 0, 0, 1000, 1000, false );
    var rh = RaphaelHelper;
    if(DEBUG) rh.drawGrid(paper, "#ccc");    
    return paper;
}

var startEngine = function(url) {

    // load style dynamically...
    $("<link/>", {
       rel: "stylesheet",
       type: "text/css",
       href: gameBaseUrl + "/style.css"
    }).appendTo("head");

    // load script dynamically
    jQuery.ajax({
        url: gameBaseUrl + "/script.js",
        dataType: 'script',
        success: function() {
            console.log("Script loaded!");
        },
        async: false
    });

    initialize(url).done(function(globals, metadata, settings) {
        console.log("Game initialized!");
        console.log("Globals:", globals);
        console.log("Game:", metadata);
        console.log("Settings:", settings);


        var loc = function(name) {
            var l = metadata.locales[settings.locale];
            if(name in l) {
                return l[name];
            } else {
                return "{" + name + "}";
            }
        } 

        // put code here...
        resetScene();

        var game = new window[metadata.gameClass]({});

        var configForm = {
            "title": "Settings",
            "description": "",
            "fields": metadata.configuration
        }
        var form = new Form(configForm);
        $("#form").html(form.body);
        var gameSettings = form.val();
        console.log("Using settings:", gameSettings);

        // render game launcher
        // (page with game title, description, preview and start/config buttons)
        showGameLauncherPage(loc, metadata, gameSettings);

    }).fail(function() {
        console.error("Failed to load JSON");
    });

}                 
