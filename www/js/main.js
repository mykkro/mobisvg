var appgui;
var engine;

$(document).ready(function() { 
  // jQuery is properly loaded at this point
  // so proceed to bind the Cordova's deviceready event
  $(document).bind("deviceready", function() {
     // Now Cordova is loaded
     // its great JS API can be used to access low-level
     // features as accelerometer, contacts and so on
     // alert("Ready!");
     $(".event.listening").hide();
     $(".event.received").show();

     // get networn and platform info...
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    alert('Connection type: ' + states[networkState]);  
    alert(device.platform);

     updatePage();
  }); 

   window.addEventListener('orientationchange',
     onOrientationChange, true);
   //for devices that don't fire orientationchange
   window.addEventListener("resize", onResize, false);

   onResize();

  var storage = window.localStorage;
  var value = storage.getItem("mobisvg") || 0;
  //alert(value);
  //storage.setItem("mobisvg", value+1);

/*
   var paper = Raphael("paper", "100%", "100%");
   paper.setViewBox( 0, 0, 1000, 1000, false );
   var startX=100, startY=100, endX=900, endY=900;
   paper.path( ["M", startX, startY, "L", endX, endY ] );



    paper.circle(100, 100, 50).attr({
        "fill": "#fff",
        "stroke": "#fff",
        "stroke-width": "10"
    }).mousedown(function(e) {
      //alert("clicked");
      var url = "https://api.github.com/legacy/repos/search/javascript"; 
      var url = "data/test.json";
      $.ajax( url ) //"https://nit.felk.cvut.cz/~myrousz/carvivi/road-editor/sample/test.json" )
        .done(function(data) {
            alert( "success" );
            console.log(data);
        })
        .fail(function(jxhr, textstatus, errorthrown) {
            console.log(jxhr, textstatus, errorthrown);
            alert( "error: "+textstatus );
        })
        .always(function() {
            alert( "complete" );
        });
    }); 
*/

var gameBaseUrl = "apps/differences";
//var gameBaseUrl = "apps/pick-twenty";
//var gameBaseUrl = "apps/mental-rotation";
//var gameBaseUrl = "apps/single-n-back";
//var gameBaseUrl = "apps/dual-n-back";
    
  appgui = new AppsGUI();
  appgui.onReady(function() {
    console.log("AppGUI ready!");
    appgui.showMainPage();
  });
  appgui.init();

});

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
 $("#stage").width(boxsize);
 $("#stage").height(boxsize);
 $("#stage").css({left:Math.floor((ww-boxsize)/2)+"px",top:Math.floor((hh-boxsize)/2)+"px"})
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