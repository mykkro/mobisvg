var HtmlWidget = Base.extend({
    constructor: function(width, height, options) {
        this.width = width;
        this.height = height;
        this.options = options || {};
        this.box = $("<div>").attr("class", "html-widget").css({
            "width": this.width + "px", 
            "height": this.height + "px"
        });
        this.setPosition(0,0);
        this.initialize(options);
        if("class" in options) {
            this.addClass(options.class)
        }
         $("#html-widgets").append(this.box);
    },
    addClass: function(cls) {
        this.box.addClass(cls);
    },
    removeClass: function(cls) {
        this.box.removeClass(cls);
    },
    setPosition: function(x, y) {
        this.x = x;
        this.y = y;
        this.box.css({"left":x+"px", "top": y+"px"});
    },
    initialize: function() {
        // override in subclasses...
        this.box.css({"background-color": "red"});
    }
});

var HtmlLabelWidget = HtmlWidget.extend({
    constructor: function(width, height, options, text) {
        console.log("Creating label widget");
        this.base(width, height, options);
        this.setText(text);
        this.box.addClass("html-label-widget");
   },

    initialize: function() {
        var self = this;
        this.body  = $("<div>");
        var style = {
            "width": this.width+"px", 
            "height": this.height+"px", 
            "text-align": "center"};
        if(this.options.backgroundColor) {
            style["background-color"] = this.options.backgroundColor;
        }
        this.body.css(style);
        this.box.html(this.body);
    },                    
    setText: function(text) {
        this.text = text;
        this.body.text(text);
    }
});


var HtmlImageWidget = HtmlWidget.extend({
    constructor: function(width, height, options, src) {
        console.log("Creating image widget");
        this.src = src;
        this.base(width, height, options);
        this.box.addClass("html-image-widget");
   },

    initialize: function() {
        var self = this;
        this.body = $('<img src="' + this.src + '"/>');
        var style = {
            "width": this.width+"px", 
            "height": this.height+"px", 
            "text-align": "center"};
        if(this.options.backgroundColor) {
            style["background-color"] = this.options.backgroundColor;
        }
        this.body.css(style);
        this.box.html(this.body);
    }
});


var HtmlInputWidget = HtmlWidget.extend({
    constructor: function(width, height, options, value) {
        console.log("Creating input widget");
        this.base(width, height, options);
        this.val(value);
        this.box.addClass("html-input-widget");
   },

    initialize: function() {
        var self = this;
        this.input  = $("<input>").attr("type", "text").attr("name", "textfield");
        if(this.options.maxlength) {
            this.input.attr("maxlength", this.options.maxlength);
        }
        var style = {
            "width": this.width+"px", 
            "height": this.height+"px", 
            "text-align": "center", 
            "border": "none"};
        this.input.prop("readonly", this.options.readonly);
        this.input.css(style);
        this.input.on('input',function(e){
            console.log("changed!", self.val());
            self.onChange(self.val());
        });
        if(this.options.numbersOnly) {
            this.input.keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                     // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                     // Allow: Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                     // Allow: Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||
                     // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                         // let it happen, don't do anything
                         return;
                }
                // convert to uppercase
                if (e.which >= 97 && e.which <= 122) {
                    var newKey = e.which - 32;
                    // I have tried setting those
                    e.keyCode = newKey;
                    e.charCode = newKey;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            });
        }
        if(this.options.lettersOnly) {
            this.input.keydown(function (e) {
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                     // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                     // Allow: Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                     // Allow: Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||
                     // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                         // let it happen, don't do anything
                         return;
                }
                // convert to uppercase
                if (e.which >= 97 && e.which <= 122) {
                    var newKey = e.which - 32;
                    // I have tried setting those
                    e.keyCode = newKey;
                    e.charCode = newKey;
                }
                // Ensure that it is a number and stop the keypress
                if (e.shiftKey || (e.keyCode < 65 || e.keyCode > 90)) {
                    e.preventDefault();
                }
            });
        }
        this.box.html(this.input);
    },
    onChange: function(val) {
        if(typeof(val)=="function") {
            this._onChange = val;
        } else {
            if(this._onChange) this._onChange(val);
        }
    },
    val: function(value) {
        if(arguments.length == 1) {
            this.value = value;
            this.input.val(this.value);
        } else {
            return this.input.val();
        }
    }

});

var HtmlButtonWidget = HtmlWidget.extend({
    constructor: function(width, height, options, text) {
        console.log("Creating button widget");
        this.base(width, height, options);
        this.setText(text);
        this.box.addClass("html-button-widget");
   },

    initialize: function() {
        var self = this;
        this.input  = $("<button>");
        var style = {
            "width": this.width+"px", 
            "height": this.height+"px", 
            "text-align": "center"};
        if(this.options.backgroundColor) {
            style["background-color"] = this.options.backgroundColor;
        }
        this.input.css(style);
        this.input.on('click',function(e){
            console.log("clicked!");
            self.onClick();
        });
        this.box.html(this.input);
    },                    
    setText: function(text) {
        this.text = text;
        this.input.text(text);
    },
    setDisabled: function(flag) {
        this.input.prop("disabled", flag);
    },
    onClick: function(val) {
        if(typeof(val)=="function") {
            this._onClick = val;
        } else {
            if(this._onClick) this._onClick(this);
        }
    }

});



var HtmlGridInputWidget = HtmlWidget.extend({

    constructor: function(width, height, rows, cols, options, value) {
        this.rows = rows;
        this.cols = cols;
        this.value = value;
        this.base(width, height, options);
        this.val(value);
        this.box.addClass("html-grid-input-widget");
    },
    initialize: function() {
        var self = this;
        var gap = this.options.gap || 0;
        var w = (this.width-(this.cols-1)*gap)/this.cols;
        var h = (this.height-(this.rows-1)*gap)/this.rows;
        this.inputs = [];
        var i=0;
        for(var y=0; y<this.rows; y++) {
            for(var x=0; x<this.cols; x++) {
                opts = $.extend({}, this.options);
                if(this.options.filledReadonly && this.value[i]) {
                    opts.readonly = true;
                }
                var inp = new HtmlInputWidget(w, h, opts, this.value[i]);
                inp.setPosition(x*w + x*gap, y*h + y*gap);
                inp.onChange(function(val) {
                    self.onChange(self.val());
                });
                this.inputs.push(inp);
                this.box.append(inp.box);
                i++;
            }
        }
        var self = this;
    },
    onChange: function(val) {
        if(typeof(val)=="function") {
            this._onChange = val;
        } else {
            if(this._onChange) this._onChange(val);
        }
    },
    val: function(value) {
        if(arguments.length == 1) {
            this.value = value;
            this._setValue(this.value);
        } else {
            return this._getValue();
        }
    },
    isFilled: function() {
        for(var i=0; i<this.inputs.length; i++) {
            if(!this.inputs[i].val()) return false;
        }                          
        return true;
    },
    _setValue: function(val) {
        for(var i=0; i<this.inputs.length; i++) {
            this.inputs[i].val(val[i]);
        }                          
    },
    _getValue: function() {
        var out = [];
        for(var i=0; i<this.inputs.length; i++) {
            out.push(this.inputs[i].val());
        }                          
        return out;
    }
});



var HtmlSeriesInputWidget = HtmlWidget.extend({

    constructor: function(width, height, options, value) {
        this.value = value;
        this.base(width, height, options);
        this.val(value);
        this.box.addClass("html-series-input-widget");
    },
    initialize: function() {
        var self = this;
        var gap = this.options.gap || 0;
        var w = (this.width-(this.value.length-1)*gap)/this.value.length;
        this.inputs = [];
        var i=0;
        for(var x=0; x<this.value.length; x++) {
            opts = $.extend({}, this.options);
            if(this.options.filledReadonly && this.value[i]) {
                opts.readonly = true;
            }
            var inp = new HtmlInputWidget(w, this.height, opts, this.value[i]);
            inp.setPosition(x*w + (x-1)*gap, 0);
            inp.onChange(function(val) {
                self.onChange(self.val());
            });
            this.inputs.push(inp);
            this.box.append(inp.box);
            i++;
        }
        var self = this;
    },
    onChange: function(val) {
        if(typeof(val)=="function") {
            this._onChange = val;
        } else {
            if(this._onChange) this._onChange(val);
        }
    },
    val: function(value) {
        if(arguments.length == 1) {
            this.value = value;
            this._setValue(this.value);
        } else {
            return this._getValue();
        }
    },
    isFilled: function() {
        for(var i=0; i<this.inputs.length; i++) {
            if(!this.inputs[i].val()) return false;
        }                          
        return true;
    },
    _setValue: function(val) {
        for(var i=0; i<this.inputs.length; i++) {
            this.inputs[i].val(val[i]);
        }                          
    },
    _getValue: function() {
        var out = [];
        for(var i=0; i<this.inputs.length; i++) {
            out.push(this.inputs[i].val());
        }                          
        return out;
    }
});


var HtmlMultiSeriesInputWidget = HtmlWidget.extend({

    constructor: function(width, height, options, value) {
        this.value = value;
        this.base(width, height, options);
        this.val(value);
        this.box.addClass("html-multi-series-input-widget");
    },
    initialize: function() {
        var self = this;
        var gap = this.options.gap || 0;
        var vgap = this.options.vgap || 0;
        var rows = this.value.length;
        var cols = 0;
        for(var i=0; i<this.value.length; i++) {
            if(this.value[i].length > cols) cols = this.value[i].length;
        }
        var h = (this.height-(rows-1)*vgap)/rows;
        var w = (this.width-(cols-1)*gap)/cols;
        this.inputs = [];
        var i=0;
        for(var y=0; y<rows; y++) {
            var ww = Math.floor(this.value[y].length*w + (this.value[y].length-1)*gap);
            opts = $.extend({}, this.options);
            var inp = new HtmlSeriesInputWidget(ww, h, opts, this.value[y]);
            inp.setPosition( Math.floor((this.width-ww)/2),  Math.floor(y*(h+vgap)));
            inp.onChange(function(val) {
                self.onChange(self.val());
            });
            this.inputs.push(inp);
            this.box.append(inp.box);
            i++;
        }
        var self = this;
    },
    onChange: function(val) {
        if(typeof(val)=="function") {
            this._onChange = val;
        } else {
            if(this._onChange) this._onChange(val);
        }
    },
    val: function(value) {
        if(arguments.length == 1) {
            this.value = value;
            this._setValue(this.value);
        } else {
            return this._getValue();
        }
    },
    isFilled: function() {
        for(var i=0; i<this.inputs.length; i++) {
            if(!this.inputs[i].isFilled()) return false;
        }                          
        return true;
    },
    _setValue: function(val) {
        for(var i=0; i<this.inputs.length; i++) {
            this.inputs[i].val(val[i]);
        }                          
    },
    _getValue: function() {
        var out = [];
        for(var i=0; i<this.inputs.length; i++) {
            out.push(this.inputs[i].val());
        }                          
        return out;
    }
});


var HtmlTimerWidget = HtmlWidget.extend({
    constructor: function(width, height, options, countdown) {
        console.log("Creating timer widget");
        this.base(width, height, options);
        this.countdown = countdown;
        this.box.addClass("html-timer-widget");
   },

    initialize: function() {
        var self = this;
        this.input  = $("<div>");
        var style = {
            "width": this.width+"px", 
            "height": this.height+"px"
        };
        this.input.css(style);
        this.input.polartimer({
          timerSeconds: this.countdown,
          color: this.options.color || '#F00',
          opacity: this.options.opacity || 0.7,
          callback: function () {
            console.log('jquery.polartimer.js: done!');
          }
        });

        this.input.polartimer('start');
        this.box.html(this.input);
    }                    

});
