
var GamePage = Base.extend({
    constructor: function(m) {
        this.m = m;
        $("#info .title").text(m.locales.en.title);
        $("#info .description").text(m.locales.en.description);
        $("#info .subtitle").text(m.locales.en.subtitle);
        $("#info .instructions").text(m.locales.en.instructions);
        $("#info .imager").html($("<img>").attr('src', gameBaseUrl + "/preview.png"));
    }
});

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

        var info = new GamePage(metadata);
        $("#info").html(info.body);


        $("#info button[name=game-start]").click(function() {
            console.log("Starting the game!");
            game = new window[metadata.gameClass](gameSettings);
            var sequence = game.generateTaskData();
            resetScene();
            //var label = new HtmlLabelWidget(600, 100,{}, loc("title"));
            //label.addClass("game-title");
            //label.setPosition(200, 50);


            //var abortBtn = new HtmlButtonWidget(60, 60,{}, "x");            
            //abortBtn.addClass("abort-btn");
            game.createGUI(r);                        

            var abortBtn = new ButtonWidget("Exit", {fontSize: 30, border: 15, anchor: "middle", radius: 20});        
            abortBtn.setPosition(910, 10);
            abortBtn.onClick(function() {
                game.abort();
            });

            var labelSvg = new TextWidget(600, 40, "middle", loc("title"));
            labelSvg.setPosition(200, 60)
            labelSvg.setStyle({"fill": "blue"})

            game.onFinish(function(result, messages) {
                console.log("Finished with result:", result);
                $("#result-wrap .results").empty();
                messages.forEach(function(m) {
                    $("#result-wrap .results").append($("<div>").text(m));
                })
                $("#gamebox-overlay").show();
            });
            game.onAbort(function() {
                console.log("Aborted!");
                $("#gamebox").hide();
                $("#info").show();
            });
            $("#info").hide();
            $("#gamebox").show();
            $("#gamebox-overlay").hide();
            game.start(sequence);                        
        });

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


    }).fail(function() {
        console.error("Failed to load JSON");
    });

}                 
