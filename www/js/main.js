var appgui;
var engine;

$(document).ready(function() {
    // jQuery is properly loaded at this point
    // so proceed to bind the Cordova's deviceready event
    $(document).bind("deviceready", function() {
        // get networn and platform info...
        var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';

        console.log('Connection type: ' + states[networkState]);
        console.log(device.platform);

        // detect locale...
        var globalization = navigator.globalization;
        globalization.getLocaleName(function(locale) {
            // locale.value can be something like "en-US", "cs-CZ"
            var loc = (locale ? locale.value : null);
            /* PouchDB stuff... */
            var db = new PouchDB('kote');
            startup((db && db.adapter) ? db : null, loc);
        });


        /* Example on how to use PouchDB... */
        /*
         var todo = {
            _id: new Date().toISOString(),
            title: "New TODO!",
            completed: false
          };
          db.put(todo, function callback(err, result) {
            if (!err) {
              console.log('Successfully posted a todo!');
                db.allDocs({
                  include_docs: true,
                  attachments: true
                }).then(function (result) {
                  console.log(result);
                  console.log("Rows: "+result.rows.length);

                  // start - logging enabled...
                  

                }).catch(function (err) {
                  console.log(err);
                  alert("Database connection error!");
                });
            } else {
               alert("Database connection error!");
            }
          });
          */

    });

    window.addEventListener('orientationchange',
        onOrientationChange, true);
    //for devices that don't fire orientationchange
    window.addEventListener("resize", onResize, false);

    
});

function testPost() {
    // testing sending request to server...
    // works on browser but not on Android
    var url = 'http://download.mykkro.cz/testing/api.php';

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        data: '{ "username": "C-Tester", "another_thing" : "thing" }',
        success: function(data) {
            console.log("Got data:", data);
            alert("Success! "+ data.success);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, jqXHR.responseText);
            alert("Error! " + jqXHR.responseText);
        }
    }); 
}

function startup(db, locale) {
    console.log("Starting up!", db, locale);

    onResize();

    //var storage = window.localStorage;
    //var value = storage.getItem("mobisvg") || 0;
    //alert(value);
    //storage.setItem("mobisvg", value+1);

    appgui = new AppsGUI(db, locale);
    appgui.onReady(function() {
        console.log("AppGUI ready!");
        appgui.showAppsPage();
    });
    appgui.init();

    ////testPost();
}

function show(text) {
    $(".event.received").text(text);
}

function onOrientationChange() {
    var msg;
    console.log("Orientation has changed");
    switch (abs(window.orientation)) {
        case 90:
            show("Device is in Landscape mode");
            break;
        default:
            show("Device is in Portrait mode");
            break;
    }
    updatePage();
}

function onResize() {
    show("Resize event fired");
    updatePage();

    var ww = window.innerWidth;
    var hh = window.innerHeight;

    // resize stage
    var boxsize = Math.min(ww, hh);
    console.log("Resized:", ww, hh, boxsize);
    var fontSize = Math.floor(boxsize/55);
    $("#form-wrapper").css("font-size", fontSize+"px");
    $("#stage").width(boxsize);
    $("#stage").height(boxsize);
    $("#stage").css({
        left: Math.floor((ww - boxsize) / 2) + "px",
        top: Math.floor((hh - boxsize) / 2) + "px"
    })
    // reposition the controls
    /*
    if(ww<hh) {
      $("#controls").removeClass("beside")
      $("#controls").addClass("below")
      $("#controls").width(ww);
      $("#controls").height(hh-ww);
    } else {
      $("#controls").addClass("beside")
      $("#controls").removeClass("below")
      $("#controls").width(ww-hh);
      $("#controls").height(hh);
    }
    */
}


function updatePage() {
    //Build an output string consisting of the different screen
    //measurement values
    var strongStart = "<strong>";
    var strongEnd = "</strong>";
    //var StrRes, or, sw, sh, ww, wh;
    var or = strongStart + "Orientation: " + strongEnd +
        (window.orientation || 0) + " degrees";
    var br = "<br/>";
    strRes = or + br;
    sw = strongStart + "Width: " + strongEnd + screen.width;
    strRes += sw + br;
    sh = strongStart + "Height: " + strongEnd + screen.height;
    strRes += sh + br;
    ww = strongStart + "Inner width: " + strongEnd +
        window.innerWidth;
    strRes += ww + br;
    wh = strongStart + "Inner height: " + strongEnd +
        window.innerHeight;
    strRes += wh + br;
    //document.getElementById('controls').innerHTML = strRes;
}