

var CombineWordsGame = Game.extend({
    constructor: function(config) {
        this.base(config);
    },
    createGUI: function(r) {
        // create grid
        r.rect(0,0,1000,1000).attr({ "fill":"ddd"});
        var self = this;
        var btn = new HtmlButtonWidget(200, 100, {"class":"btn3"}, "OK");
        btn.setDisabled(true);
        btn.setPosition(400, 800);
        btn.onClick(function() {
            // evaluate the result...
            console.log("Answer: ", self.answer);
            self.finish(self.answer);
        });
        this.okButton = btn;
    },
    generateTaskData: function(options) {
        return CombineWordsGame.words;
    },            
    renderFrame: function() {
        var self = this;

        var cAs = [];
        var cBs = [];
        var lastCA = null;
        var lastCB = null;
        var selectedA = null;
        var selectedB = null;

        noConnections = 0;
        connections = {};

        var disconnectComponents = function(cA, cB) {
            cA.child.setStyle({"fill": "white"}); 
            cB.child.setStyle({"fill": "white"}); 
            cA.selected = false;
            cB.selected = false;
            noConnections--;
            delete connections[cA.order];
            console.log(connections);
            self.okButton.setDisabled(true);
        }


        var connectComponents = function(cA, cB) {
            cA.child.setStyle({"fill": "gray"}); 
            cB.child.setStyle({"fill": "gray"}); 
            cA.selected = true;
            cB.selected = true;
            selectedA = null;
            selectedB = null;
            lastCA = null;
            lastCB = null;
            var nA = cA.order;
            var nB = cB.order;
            r.line(375+10, nA*60+325, 625-10, nB*60+325).attr({
                "stroke-width": 10, "stroke": "red", 'arrow-end': 'classic-wide-long', 
        'arrow-start': 'classic-wide-long' }).click(function() {
                console.log("clicked!");
                this.remove();
                disconnectComponents(cAs[nA], cBs[nB]);
            });
            connections[nA] = nB;
            console.log(connections);
            noConnections++;
            if(noConnections == self.orig.length) {
                console.log("All connected!");      
                self.answer = [];               
                for(var i=0; i<self.orig.length; i++) {
                    var ccA = cAs[i];
                    var ccB = cBs[connections[i]];
                    console.log(ccA.number, ccB.number);
                    self.answer.push(ccB.number);
                }
                self.okButton.setDisabled(false);   
            }
        }

        for(var i=0; i<self.orig.length; i++) {
            var bkgrA = new RectWidget(150, 50);
            bkgrA.setPosition(225, 300+60*i);
            var bkgrB = new RectWidget(150, 50);
            bkgrB.setPosition(625, 300+60*i);
            var labelA = new TextWidget(100, 30, "middle", self.p1[self.orig[i]]);
            labelA.setPosition(225+25, 300+10+60*i);
            var labelB = new TextWidget(100, 30, "middle", self.p2[self.perm[i]]);
            labelB.setPosition(625+25, 300+10+60*i);
            var cA = new Clickable(bkgrA);
            cA.order = self.orig[i];
            cA.number = self.orig[i];
            cA.onClick(function(cc, e) {
                if(cc.selected) return;
                if(lastCA) {
                    lastCA.child.setStyle({"fill": "white"});    
                }
                if(lastCA != cc) {
                    cc.child.setStyle({"fill": "green"});
                    lastCA = cc;
                    selectedA = cc.order;
                    if(selectedA !== null && selectedB !== null) {
                        connectComponents(cAs[selectedA], cBs[selectedB]);
                    }
                }
            });
            var cB = new Clickable(bkgrB);
            cB.number = self.perm[i];
            cB.order = self.orig[i];
            cB.onClick(function(cc, e) {
                if(cc.selected) return;
                if(lastCB) {
                    lastCB.child.setStyle({"fill": "white"});    
                }
                if(lastCB != cc) {                        
                    cc.child.setStyle({"fill": "orange"});
                    lastCB = cc;
                    selectedB = cc.order;
                    if(selectedA !== null && selectedB !== null) {
                        connectComponents(cAs[selectedA], cBs[selectedB]);
                    }
                }
            });
            cAs.push(cA);
            cBs.push(cB);

        }

    },
    start: function(gamedata) {
        this.base(gamedata);
        var p1=[], p2=[], orig=[], perm=[];
        var i=0;
        gamedata.forEach(function(p) {
            console.log(p);
            var pp = p.split("-");
            p1.push(pp[0]);
            p2.push(pp[1]);  
            orig.push(i);
            perm.push(i++);                  
        });
        shuffle(perm);
        this.p1 = p1;
        this.p2 = p2;
        this.orig = orig;
        this.perm = perm;
        console.log(p1, p2, orig, perm);

        this.task = new SequenceBinaryTask(this.orig);
        this.renderFrame();

    }
},{
    words: [
        "AUTO-MOBIL",
        "TELE-VIZE",
        "PREZI-DENT",
        "EKO-LOGIE",
        "KALKU-LACE",
        "DOMOV-NICE"
    ]
});
