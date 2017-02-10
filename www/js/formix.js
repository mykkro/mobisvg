var renderHeader = function(title, description) {
    return $("<h2>").text(title);
}

var renderLabel = function(label) {
    return $("<label>").text(label);    
}

var renderInput = function(fld) {
    if(fld.type == "boolean") {
        return new CheckboxInput(fld);
    }
    if(fld.type == "int") {
        if(fld.maxValue-fld.minValue < 10) {
            if(fld.maxValue-fld.minValue < 5) {
                return new RadioInput(fld);
            }
            return new SelectInput(fld);
        }
        return new NumberInput(fld);    
    }
    if(fld.values) {
        if(fld.values.length < 5) {
            return new RadioInput(fld);
        }
        return new SelectInput(fld);
    }
    return new TextInput(fld);
}

var Input = Base.extend({
    constructor: function(fld) {                    
        this.fld = fld;
    },
    val: function(val) {
        if(arguments.length) {
            this._setValue(val);
        } else {
            return this._getValue();
        }
    },
    _setValue: function(val) {
    },
    _getValue: function() {                        
    }
});

var TextInput = Input.extend({
    constructor: function(fld) {                    
        this.base(fld);
        this.input = $("<input>").attr({"type":"text", "name":fld.name, "value": fld.default});
    },
    _setValue: function(val) {
        this.input.val(val);
    },
    _getValue: function() { 
        return this.input.val();                       
    }
});

var NumberInput = Input.extend({
    constructor: function(fld) {
        this.base(fld);
        this.input = $("<input>").attr({"type":"text", "name":fld.name, "value": fld.default});
    },
    _setValue: function(val) {
        this.input.val(val);
    },
    _getValue: function() { 
        return parseInt(this.input.val());                       
    }
});

var CheckboxInput = Input.extend({
    constructor: function(fld) {
        this.base(fld);
        var inp = $("<input>").attr({"type":"checkbox", "name":fld.name});
        inp.prop('checked', fld.default);
        this.input = inp;
    },
    _setValue: function(val) {
        this.input.prop("checked", !!val);
    },
    _getValue: function() { 
        return this.input.is(':checked');                     
    }
});

var SelectInput = Input.extend({
    constructor: function(fld) {
        this.base(fld);
        console.log("Rendering select input", fld);
        var out = $("<select>").attr({"name":fld.name});
        var values = fld.values;
        var valueLabels = fld.valueLabels || values;
        if(fld.type=="int") {
            values = [];
            valueLabels = [];
            for(var j=fld.minValue; j<=fld.maxValue; j++) {
                values.push(""+j);
                valueLabels.push(""+j);
            }
        }
        for(var i=0; i<values.length; i++) {
            out.append($("<option>").attr({"value":values[i]}).text(valueLabels[i]));
        }
        out.val(fld.default);
        this.input = out;                    
    },
    _setValue: function(val) {
        this.input.val(val);
    },
    _getValue: function() { 
        var out = this.input.val();                       
        if(this.fld.type == "int") {
            out = parseInt(out);
        }
        return out;
    }

});

var RadioInput = Input.extend({
    constructor: function(fld) {
        this.base(fld);
        console.log("Rendering radio input", fld);
        var out = $("<div class=\"formix-radiogroup\">");
        var values = fld.values;
        var valueLabels = fld.valueLabels || fld.values;
        if(fld.type=="int") {
            values = [];
            valueLabels = [];
            for(var j=fld.minValue; j<=fld.maxValue; j++) {
                values.push(""+j);
                valueLabels.push(""+j);
            }
        }
        for(var i=0; i<values.length; i++) {
            out.append($("<span>").text(valueLabels[i]));
            var inp = $("<input>").attr({"type":"radio", "name": fld.name, "value":values[i]});
            if(values[i] == fld.default) {
                inp.attr("checked", true);
            }
            out.append(inp);
        }
        out.val(fld.default);
        this.input = out;
    },
    _setValue: function(val) {
        $('input:radio[name='+this.fld.name+']').val([""+val]);
    },
    _getValue: function() { 
        var out = $('input:radio[name='+this.fld.name+']:checked').val();                      
        if(this.fld.type == "int") {
            out = parseInt(out);
        }
        return out;
    }
});


var Field = Base.extend({
    constructor: function(fld) {
        this.name = fld.name;
        this.title = fld.title || fld.name;
        this.input = renderInput(fld);
        this.body = $("<div>").addClass("formix-field").append(
            renderLabel(this.title),
            this.input.input
            );
    },
    val: function(value) {
        if(arguments.length) {
            this.input.val(value);
        } else {
            return this.input.val();
        }
    }
});
var Form = Base.extend({
    constructor: function(frm) {
        this.fields = [];
        var self = this;
        var out = $("<div>").addClass("formix");
        var body = $("<div>").addClass("formix-body");
        out.append(
            renderHeader(frm.title, frm.descripton),
            body
            );
        frm.fields.forEach(function(fld) {
            var f = new Field(fld);
            self.fields.push(f);
            body.append(f.body);
        });
        this.body = out;
    },
    val: function(value) {
        if(arguments.length) {
            this._setValue(value);
        } else {
            return this._getValue();
        }
    },
    _setValue: function(val) {
        this.fields.forEach(function(ff) {
            ff.val(val[ff.name]);
        });
    },
    _getValue: function() { 
        var out = {};                       
        this.fields.forEach(function(ff) {
            out[ff.name] = ff.val();
        });
        return out;
    }
});