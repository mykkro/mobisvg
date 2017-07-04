
var HistoryLogger = Base.extend({
    constructor: function(db, locale, usertoken) {
        console.log("History.constructor", db, locale, usertoken);
        this.db = db;
        this.locale = locale;
        this.usertoken = usertoken;
    },
    stringifySettings: function(settings) {
        out = [];
        for(key in settings) {
            out.push(key+"="+settings[key]);            
        }
        return out.join(",");
    },
    logGameEvent: function(game, gamepack, locale, settings, eventType, eventData, eventData2, eventData3) {
        var timestamp = new Date().toISOString();
        var settingsStr = this.stringifySettings(settings);
        var idStr = game + ":" + gamepack + ":" + locale + ":" + settingsStr;
        console.log("Log game event:", this.usertoken, timestamp, idStr, idStr.hashCode(), eventType, eventData, eventData2, eventData3);
        var logItem = {
            "$type": "game-event",
            "_id": timestamp,
            "usertoken": this.usertoken,
            "timestamp": timestamp,
            "game": game,
            "gamepack": gamepack,
            "locale": locale,
            "settings": settings,
            "ident": idStr,
            "hash": idStr.hashCode(),
            "eventType": eventType,
            "eventData": eventData,
            "eventData2": eventData2,
            "eventData3": eventData3
        }
        this.storeToDB(logItem);
    },
    storeToDB: function(logItem) {
        // console.log("Storing to DB:", logItem);
        var self = this;
        if(!self.db) {
            // database not available...
            // TODO use local storage!
        } else {
          self.db.put(logItem, function callback(err, result) {
            // console.log("PouchDB.put:", err, result);
          });
        }

    },
    renderHistory: function(loc, data, messageIfEmpty) {
        // TODO move this to separate class

        var makeGameTitle = function(gameTitle) {
            return $("<span>").addClass("gametitle").text(gameTitle);
        }

        var makeGamepackTitle = function(gamepackTitle) {
            return $("<span>").addClass("gamepacktitle").text(gamepackTitle);
        }

        var makeLocaleWidget = function(locale) {
            return $("<span>").text(locale);
        }

        var makeSettingsWidget = function(settings) {
            var si = [];
          for(s in settings) {
            si.push(s + "=" + settings[s]);
          }
            return $("<div>").addClass("gamesettings").text(si.join(", "));
        }

        var makeGameItem = function(rec) {
          var game = rec.game;
          var gamepack = rec.gamepack;
          var locale = rec.locale;
          var ident = rec.ident;
          var settings = rec.settings;
            return $("<div>").addClass("gameitem").append(
            $("<div>").addClass("gametitlebar").append(
              makeGameTitle(game),
              makeGamepackTitle(gamepack),
              makeLocaleWidget(locale)
            ),
            makeSettingsWidget(settings)
          );
        }

        var makeDateTime = function(date, time) {
            return $("<div>").addClass("datetime").append(
            $("<div>").addClass("gamedate").text(date),
            $("<div>").addClass("gametime").text(time)
          );
        }

        var makeResults = function(results) {
          var res = $("<div>").addClass("gameresults");
            var rr = [];
          results.forEach(function(r) {
            if(typeof(r) == "string") {
              var parts = r.split(":");
              if(parts.length == 2) {
                var label = parts[0];
                var value = parts[1];
                rr.push({"label": label, "value": value});
              }
            }
          });
          rr.forEach(function(r) {
                console.log(r.label, r.value);
                res.append(
                    $("<div>").addClass("gameresult").append(
                    $("<div>").addClass("gamelabel").text(r.label),
                    $("<div>").addClass("gamevalue").text(r.value)
                  )
                );
          });
          return res;
        }

        //var locale = "en-US";
        //var loc = "cs-CZ";

        var records = data.docs || [];

        $("#history-form").empty();
        if(records.length == 0) {
            var msg = $("<div>").addClass("historyempty").text(messageIfEmpty).appendTo($("#history-form"));
            return;            
        }

        // group records by ident
        var idents = [];
        var identMap = {};
        records.forEach(function(r) {
            if(r.ident in identMap) {
            identMap[r.ident].push(r);
          } else {
            idents.push(r.ident);
            identMap[r.ident] = [r];
          }
        });

        var out = $("<div>").addClass("output").appendTo($("#history-form"));
        idents.forEach(function(ident) {
          var records = identMap[ident];
          var first = records[0];
          var gi = $("<div>").addClass("gametopitem").appendTo(out);
          var el = makeGameItem(first);
          gi.append(el);
          records.forEach(function(r) {
            var ts = r.timestamp;
            var dt = new Date(ts);
            var date = dt.toLocaleDateString(loc);
            var time = dt.toLocaleTimeString(loc, {hour: '2-digit', minute:'2-digit', second: '2-digit'});
            var result = r.eventData3 || [];
            console.log("Rec:", date, time, result);
            var el1 = makeDateTime(date, time);
            var el2 = makeResults(result);
            gi.append($("<div>").addClass("gamerecord").append(el1, el2));
          });
        })

    }
});
