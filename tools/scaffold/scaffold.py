#!/usr/bin/env python

# -*- coding: utf-8 -*-

import os, sys, yaml, json

SRCDIR = "."
TGTDIR = "tmp"


def scaffold(data):
    print "Scaffolding applications..."
    print
    print_framework_info(data)
    scaffold_locales("", data["locales"])
    scaffold_apps(data["apps"])


def scaffold_locales(dir, data):
    for loc in data:
        scaffold_locale(os.path.join(dir, "locales"), loc)


def scaffold_apps(data):
    for app in data:
        scaffold_app(app)


def scaffold_locale(dir, loc):
    name = loc.keys()[0]
    locale = loc.values()[0] or []
    path = os.path.join(dir, name, "translations.yaml")
    out_dir = os.path.join("tmp", dir, name)
    ensure_directory(out_dir)
    out_path = os.path.join(out_dir, "metadata.json")
    scaffold_metadata(locale, out_path, language=name)
    if os.path.exists(path):
        out_path = os.path.join(out_dir, "translations.json")
        scaffold_vocabulary(path, out_path, language=name)


def scaffold_metadata(locale, out_path, language="en", version="1.0"):
    # generate metadata.json
    print "Generating metadata.json"
    out = {}
    for loc in locale:
        for key in loc:
            out[key] = loc[key]
    meta = {
        "$type": "playonweb-localized-metadata",
        "version": version,
        "language": language,
        "keys": out
    }
    put_json_file(out_path, meta)


def scaffold_vocabulary(path, out_path, language="en", version="1.0"):
    # generate translations.json
    print "Generating translations.json"
    with open(path, 'r') as stream:
        data = yaml.load(stream)
        vocab = {
            "$type": "playonweb-translation",
            "version": version,
            "language": language,
            "translations": data
        }
        put_json_file(out_path, vocab)


def ensure_directory(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)


def put_json_file(path, data):
    directory = os.path.dirname(path)
    ensure_directory(directory)
    with open(path, 'w') as fp:
        json.dump(data, fp, ensure_ascii=True, indent=4)


def scaffold_app(app):
    app_name = app["name"]
    dir = os.path.join("apps", app_name)
    gamepack_dir = os.path.join(dir, "gamepacks")
    asset_dir = os.path.join(dir, "assets")
    out_dir = os.path.join("tmp", dir)
    ensure_directory(out_dir)
    out_dir = os.path.join("tmp", gamepack_dir)
    ensure_directory(out_dir)
    out_dir = os.path.join("tmp", asset_dir)
    ensure_directory(out_dir)

    scaffold_locales(dir, app.get("locales", []))

    print "Scaffolding app: %s" % app_name
    print app


def print_framework_info(data):
    """
    doctype: playonweb-app-scaffold
    version: 1.0
    last_update: 2017-02-14
    locales:
      - en:
      - cz:
    apps:
    """
    print "Doctype: %s" % data.get("doctype", "")
    print "Version: %s" % data.get("version", "")
    print "Last update: %s" % data.get("last_update", "")




###############################################################################

with open("main.yaml", 'r') as stream:
    try:
        data = yaml.load(stream)
        scaffold(data)
    except yaml.YAMLError as exc:
        print(exc)