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
     updatePage();
  }); 

   window.addEventListener('orientationchange',
     onOrientationChange, true);
   //for devices that don't fire orientationchange
   window.addEventListener("resize", onResize, false);

   onResize();

  var storage = window.localStorage;
  var value = storage.getItem("mobisvg") || 0;
  alert(value);
  storage.setItem("mobisvg", value+1);

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

      $.ajax( "https://api.github.com/legacy/repos/search/javascript" ) //"https://nit.felk.cvut.cz/~myrousz/carvivi/road-editor/sample/test.json" )
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
 // reposition the controls
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
     console.log(or);
     strRes = or + br;
     sw = strongStart + "Width: " + strongEnd + screen.width;
     console.log(sw);
     strRes += sw + br;
     sh = strongStart + "Height: " + strongEnd + screen.height;
     console.log(sh);
     strRes += sh + br;
     ww = strongStart + "Inner width: " + strongEnd +
       window.innerWidth;
     console.log(ww);
     strRes += ww + br;
     wh = strongStart + "Inner height: " + strongEnd +
       window.innerHeight;
     console.log(wh);
     strRes += wh + br;
     document.getElementById('controls').innerHTML = strRes;
   }