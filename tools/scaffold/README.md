MobiSVG App Scaffolding
=======================

App Structure (v1.0)
--------------------

[web-root]/
  index.json - apps index file
  locales/
    en/
        translations.json
        metadata.json - the framework metadata, localized
  apps/
    [appname]/
        app.json - app metadata file with config
        preview.png - a 256x256 PNG preview image (language independent)
        style.css - CSS stylesheet
        script.js - Implementation of the app (app class, subclass of Game)
        settings.json - default app settings
        assets/ - here are gamepack-independent game assets
            index.json - asset index file
        locales/
            en/
                translations.json - map of translations
                metadata.json - metadata (title, subtitle...)
                preview.png - language dependent app preview, optional...
        gamepack/ - here are game levels (gamepacks)
            index.json - gamepacks index file
            [gamepackname]/
                assets/ - here are gamepack dependent game assets
                    index.json - asset index file
                locales/
                    en/
                        translations.json - map of translation (extra in gamepack)
                        metadata.json - gamepack metadata (title, subtitle, description...)
                        preview.png - language dependent gamepack preview, optional
                gamepack.json - gamepack metadata file
                preview.png - language independent gamepack preview, optional
                settings.json - gamepack default settings (overrides the app settings)

Files
-----

Translation file (translation.json)

{
    "$type": "playonweb-translation",
    "version": "1.0",
    "language": "es",
    "translations": {
        "World": "mundo", 
        ...
    }
}

Localized metadata for framework/app/gamepack (metadata.json)

{
    "$type": "playonweb-localized-metadata",
    "version": "1.0",
    "language": "en",
    "keys": {
        "title": "Super Simple Demo Game",
        "subtitle": ...
        "description": ...
        "instructions": ...
        ... (keys depend on the type of target - framework, app, gamepack...)
    }
}

App descriptor (app.json)

{
    "$type": "playonweb-app",
    "version": "1.0",
    "name": "sudoku",
    "author": or "authors": ...,
    "tags": [
      "entertaimnent", "sudoku" ...
    ],
    "gameClass": "SudokuGame",
    "configuration": [
      ... app config fields ...
    ],
    "scripts": [ 
       "extra-script.js" ...
    ],
    "styles": [
       "extra-style.css" ...
    ],
    "resources": {
        "background": "assets/bkgr.png" ... - named assets
    }
}


Gamepack descriptor (gamepack.json)

{
    "$type": "playonweb-gamepack",
    "version": "1.0",
    "name": "default",
    "author": "...", (or "authors": []),
    "resources": {
        named resources in assets/ subdir
    }
    
}

Index files (index.json) - autogenerated? (or, just a single master-index 
capturing entire dir structure)

{
    "$type": "playonweb-index",
    "items": [
        "sudoku",
        "questionary"
       ....
    ]
}

Settings file for app/gamepack (settings.json)

{
    "$type": "playonweb-settings",
    "values": {
        "N": 10,
        "delay": 500
        ....
    }

}


Tools
-----

- 1. create master index file
- 2. generate directory structure (or ensure the part's existence)  based on a single Yaml file
- 3. update the Yaml file based on the dir structure

