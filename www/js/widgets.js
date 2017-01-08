
function isPhoneGap() {
    return (window.cordova || window.PhoneGap || window.phonegap) 
    && /^file:\/{3}[^\/]/i.test(window.location.href) 
    && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}


var r = null;
var DEBUG = false;
var MOBILE = isPhoneGap();

// basic UI widget
var Widget = Base.extend({
    constructor: function() {
        this.x = 0;
        this.y = 0;
        this.root = r.set();
    },
    setPosition: function(x, y) {
        this.x = x;
        this.y = y;
        this.root.transform("T"+x+","+y);
    },
    setStyle: function(attr) {
        // apply your styles here...
        this.style = attr;
    }
}, {
    // global styles/utility functions
});

// UI widget with defined dimensions
var SizedWidget = Widget.extend({
    constructor: function(w, h) {
        this.base();
        this.w = w;
        this.h = h;
    }
});

// bb = new ButtonWidget("Hello, world", 20, 10, 20)
var ButtonWidget = Widget.extend({
    constructor: function(text, options) {
        this.base();
        var o = options || {};
        this.o = o;
        o.fontSize = o.fontSize || 40;
        o.border = o.border || 20;
        o.radius = o.radius || 30;
        var anchor = o.anchor;
        var border = o.border;
        var radius = o.radius;
        var textStyle = {"font-family" : "Helvetica", "font-size" : o.fontSize, "text-anchor" : "start"};
        var emptyStyle = {"fill": "none", "stroke":"none"};
        var ttt = r.text(0,0,text).attr(textStyle);
        var bbox = ttt.node.getBBox();
        var tw = bbox.width;
        var th = bbox.height;
        var tx = bbox.x;
        var ty = bbox.y;
        var x = 0;
        var y = 0;
        this.dx = border - tx;
        this.dy = border - ty;
        this.ttt = ttt;
        ttt.transform("T"+(x + this.dx)+","+(y + this.dy));
        var rrr = r.rect(x, y, tw+2*border, th+2*border, radius).attr(ButtonWidget.backgroundStyle);
        ttt.toFront();
        this.rrr = rrr;
        var bbb = r.rect(x, y, tw+2*border, th+2*border, radius).attr(emptyStyle);    
        bbb.node.setAttribute("class","svgbutton");
        this.root.push(rrr);
        this.root.push(ttt);
        this.root.push(bbb);   
        var self = this; 
        // use Raphael's touch events
        if(MOBILE) {
            bbb.touchstart(function(e) {
                if(!self.disabled) {
                    self.onClick();
                }
            });
        } else {
            bbb.mousedown(function(e) {
                if(!self.disabled) {
                    self.onClick();
                }
            });            
        }
        this.w = tw+2*border;
        this.h = th + 2*border;
    },
    setPosition: function(x, y) {
        this.base(x, y);
        this.ttt.transform("T"+(x + this.dx)+","+(y + this.dy));
    },
    setDisabled: function(flag) {
        this.disabled = flag;
        this.rrr.attr(flag ? ButtonWidget.disabledBackgroundStyle : ButtonWidget.backgroundStyle)
    },
    onClick: function(val) {
        if(typeof(val)=="function") {
            this._onClick = val;
        } else {
            if(this._onClick) this._onClick(this);
        }
    }

}, {
    backgroundStyle: {"fill": "#aac", "stroke":"#333"},
    disabledBackgroundStyle: {"fill": "#eee", "stroke":"#333"}
});

// resizable UI widget with defined dimensions
var ResizableWidget = SizedWidget.extend({
    constructor: function(w, h) {
        this.base(w, h);
    },
    setSize: function(w, h) {
        this.w = w;
        this.h = h;
    }
});

// dummy widget - simple rectangle
var RectWidget = ResizableWidget.extend({
    constructor: function(w, h, radius) {
        this.base(w, h);
        this.shape = r.rect(this.x, this.y, this.w, this.h, radius);
        this.setStyle({"stroke": "red", "fill": "white"});
        this.root.push(this.shape);
    },
    setStyle: function(attr) {
        this.base(attr);
        this.shape.attr(attr);
    },
    setSize: function(w, h) {
        this.base(w, h);
        this.shape.attr({"width": this.w, "height": this.h});
    }
});

// dummy widget - simple circle
var CircleWidget = ResizableWidget.extend({
    constructor: function(radius) {
        this.radius = radius;
        this.base(2*radius, 2*radius);
        this.x = radius;
        this.y = radius;
        this.shape = r.circle(this.x, this.y, this.radius);
        this.setStyle({"stroke": "red", "fill": "white"});
        this.root.push(this.shape);
    },
    setStyle: function(attr) {
        this.base(attr);
        this.shape.attr(attr);
    },
    setRadius: function(r) {
        var x = this.x - this.radius;
        var y = this.y - this.radius;
        this.radius = r;
        this.setPosition(x + this.radius, y + this.radius);
        this.setSize(x + this.radius, y + this.radius);
        this.shape.attr({"r": this.radius});
    },
    // do not call tjhis directly
    // use setRadius instead
    setSize: function(w, h) {
        this.base(w, h);
    }
});

function sector(cx, cy, radius, startAngle, endAngle, params) {
    var rad = Math.PI / 180;
    var x1 = cx + radius * Math.cos(-startAngle * rad),
        x2 = cx + radius * Math.cos(-endAngle * rad),
        y1 = cy + radius * Math.sin(-startAngle * rad),
        y2 = cy + radius * Math.sin(-endAngle * rad);
    return r.path(["M", cx, cy, "L", x1, y1, "A", radius, radius, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
}

var PieWidget = ResizableWidget.extend({
    constructor: function(radius, startAngle, endAngle) {
        this.radius = radius;
        this.base(2*radius, 2*radius);
        this.x = 0;
        this.y = 0;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.style = {"stroke": "red", "fill": "white"};
        this._updateShape();
    },
    _updateShape: function() {
        if(this.shape) {
            this.shape.remove();
        }
        this.root.clear();
        this.shape = sector(this.x+this.radius, this.y+this.radius, this.radius, this.startAngle, this.endAngle, {});
        this.setStyle(this.style);
        this.root.push(this.shape);
    },
    setStyle: function(attr) {
        this.base(attr);
        this.shape.attr(attr);
    },
    setAngles: function(startAngle, endAngle) {
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this._updateShape();
    },
    setPosition: function(x, y) {
        this.base(x, y);
        this._updateShape();
    }
});

// multi-line text label widget
// anchor - one of: start middle end
// !!!!! multiline works properly only for anchor=start!
var TextWidget = Widget.extend({
    constructor: function(maxWidth, fontSize, anchor, text) {
        this.base();
        this.fontSize = fontSize;
        this.anchor = anchor;
        this.textStyle = {"font-family" : "Helvetica", "font-weight" : "bold", "font-size" : fontSize, "text-anchor" : anchor};
        var x = 0;
        if(anchor == "middle") {
            x = maxWidth/2;                            
        } else if(anchor == "end") {
            x = maxWidth;
        }
        this.shape = r.paragraph({x : x, y : fontSize / 2, maxWidth : maxWidth, text : text, textStyle : this.textStyle });
        this.root.push(this.shape);
    },
    setStyle: function(attr) {
        this.base(attr);
        this.shape.attr(attr);
    }
});


var ImageWidget = ResizableWidget.extend({
    constructor: function(url, width, height) {
        this.base(width, height);
        this.image = r.image(url, 0, 0, this.w, this.h);
        this.root.push(this.image);
    },
    setSize: function(w, h) {
        this.base(w, h);
        this.image.attr({"width": this.w, "height": this.h});
    }
});


// TODO: setPosition does not work OK (it moves only the overlay)
var Clickable = SizedWidget.extend({
    constructor: function(child) {
        this.child = child;
        this.base(child.w, child.h);
        var self = this;
        var overlay = r.rect(child.x, child.y, child.w, child.h).attr({"fill":"white", "stroke": "none", "opacity": 0.1});
        this.root.push(child);
        this.root.push(overlay);
        overlay.mousedown(function(e) {
            self.mouseDown(e);
        }).mouseup(function(e) {
            self.mouseUp(e);
        }).mouseover(function(e) {
            self.mouseOver(e);
        }).mouseout(function(e) {
            self.mouseOut(e);
        });
    },
    _getMouseCoordinates: function(e) {
        var bnds = e.target.getBoundingClientRect();   
        var fx = (e.clientX - bnds.left)/bnds.width * this.w;
        var fy = (e.clientY - bnds.top)/bnds.height * this.h;
        return { x: fx, y: fy };
    },
    onClick: function(val) {
        if(typeof(val)=="function") {
            this._onClick = val;
        } else {
            if(this._onClick) this._onClick(this, val);
        }
    },
    mouseDown: function(e) {
        console.log("Down!");
        // get mouse coordinates...
        console.log(this._getMouseCoordinates(e));
        this.onClick(e);
    },
    mouseUp: function(e) {
        console.log("Up!");
    },
    mouseOver: function(e) {
        console.log("Over!");
    },
    mouseOut: function(e) {
        console.log("Out!");
    }
});
