
var HistoryLogger = Base.extend({
    constructor: function(db, locale) {
        console.log("History.constructor", db, locale);
        this.db = db;
        this.locale = locale;
    },
    stringifySettings: function(settings) {
        out = [];
        for(key in settings) {
            out.push(key+"="+settings[key]);            
        }
        return out.join(",");
    },
    logGameEvent: function(game, gamepack, locale, settings, eventType, eventData) {
        var timestamp = new Date().toISOString();
        var settingsStr = this.stringifySettings(settings);
        var idStr = game + ":" + gamepack + ":" + locale + ":" + settingsStr;
        console.log("Log game event:", timestamp, idStr, idStr.hashCode(), eventType, eventData);
        var logItem = {
            "$type": "game-event",
            "_id": timestamp,
            "timestamp": timestamp,
            "game": game,
            "gamepack": gamepack,
            "locale": locale,
            "settings": settings,
            "ident": idStr,
            "hash": idStr.hashCode(),
            "eventType": eventType,
            "eventData": eventData
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

    }
});
