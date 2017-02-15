#!/usr/bin/env python

# -*- coding: utf-8 -*-

import os, sys, yaml, json
from shutil import copyfile
from distutils.dir_util import copy_tree


SRCDIR = "."
TGTDIR = "tmp"


def scaffold(data):
    print "Scaffolding applications..."
    print
    print_framework_info(data)
    scaffold_locales("", "tmp", data["locales"])
    scaffold_apps(data["apps"])


def scaffold_locales(dir, out_dir, data):
    for loc in data:
        scaffold_locale(os.path.join(dir, "locales"), os.path.join(out_dir, "locales"), loc)


def scaffold_gamepacks(dir, out_dir, data):
    for gp in data:
        scaffold_gamepack(os.path.join(dir, "gamepacks"), os.path.join(out_dir, "gamepacks"), gp)


def scaffold_assets(dir, out_dir):
    dir = os.path.join(dir, "assets")
    out_dir = os.path.join(out_dir, "assets")
    if os.path.isdir(dir):
        ensure_directory(out_dir)
        copy_tree(dir, out_dir)


def scaffold_apps(data):
    for app in data:
        scaffold_app(app)


def copy_file_if_exists(src_path, dst_path):
    if os.path.exists(src_path):
        copyfile(src_path, dst_path)


def scaffold_preview(src_dir, out_dir):
    copy_file_if_exists(os.path.join(src_dir, "preview.png"), os.path.join(out_dir, "preview.png"))


def scaffold_locale(dir, out_dir, loc):
    name = loc.keys()[0]
    locale = loc.values()[0] or []

    dir = os.path.join(dir, name)
    out_dir = os.path.join(out_dir, name)
    ensure_directory(out_dir)

    # scaffold metadata
    out_path = os.path.join(out_dir, "metadata.json")
    scaffold_metadata(locale, out_path, language=name)

    # scaffold translations
    path = os.path.join(dir, "translations.yaml")
    if os.path.exists(path):
        out_path = os.path.join(out_dir, "translations.json")
        scaffold_vocabulary(path, out_path, language=name)

    # copy preview.png if it exists
    scaffold_preview(dir, out_dir)

    # copy assets if any
    scaffold_assets(dir, out_dir)


def scaffold_gamepack(dir, out_dir, gp):
    name = gp["name"]
    locales = gp.get("locales", []) or []
    resources = gp.get("resources", []) or []

    dir = os.path.join(dir, name)
    out_dir = os.path.join(out_dir, name)
    ensure_directory(out_dir)
    print "Scaffolding gamepack %s" % name

    # scaffold locales
    scaffold_locales(dir, out_dir, locales)

    # scaffold resources
    scaffold_resources(dir, out_dir, resources)

    # copy preview.png if it exists
    scaffold_preview(dir, out_dir)

    # copy assets if any
    scaffold_assets(dir, out_dir)


def scaffold_resources(dir, out_dir, resources):
    print "Scaffolding resources"
    print dir, resources


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


# app definition dir may contain:
#   preview.png
#   app.yaml
#   config.yaml
#   script.js
#   style.css
#   assets/
#   gamepacks/
#   locales/
def scaffold_app(app):
    app_name = app["name"]
    dir = os.path.join("apps", app_name)
    out_dir = os.path.join("tmp", dir)
    app_yaml = load_yaml_file(os.path.join(dir, "app.yaml"))
    print "Loaded app data: %s" % app_name, app_yaml

    out_root = out_dir
    ensure_directory(out_dir)
    gamepack_dir = os.path.join(dir, "gamepacks")
    out_gamepacks = os.path.join("tmp", gamepack_dir)
    ensure_directory(out_gamepacks)

    scaffold_locales(dir, out_root, app_yaml.get("locales", []) or [])

    scaffold_gamepacks(dir, out_root, app_yaml.get("gamepacks", []) or [])

    # generate script.js
    scaffold_script(dir, out_root, app_yaml.get("scripts", []) or [])

    # generate style.css
    scaffold_style(dir, out_root, app_yaml.get("styles", []) or [])

    # copy preview.png if it exists
    scaffold_preview(dir, out_root)

    # copy assets if any
    scaffold_assets(dir, out_root)

    print "Scaffolding app: %s" % app_name
    print app


def load_text_file(path):
    with open(path, 'r') as myfile:
        data = myfile.read()
        return data


def write_text_file(path, text):
    with open(path, 'w') as myfile:
        myfile.write(text)


def scaffold_script(src_dir, tgt_dir, script_list=[]):
    # there should be always script.js in src_dir
    scripts = []
    for sc in script_list:
        scripts.append(load_text_file(os.path.join(src_dir, sc)))
    scripts.append(load_text_file(os.path.join(src_dir, "script.js")))
    out = "\n".join(scripts)
    outfile = os.path.join(tgt_dir, "script.js")
    print "Generated script: %s" % outfile
    write_text_file(outfile, out)
    return out


def scaffold_style(src_dir, tgt_dir, style_list=[]):
    # there should be always style.css in src_dir
    styles = []
    for sc in style_list:
        styles.append(load_text_file(os.path.join(src_dir, sc)))
    styles.append(load_text_file(os.path.join(src_dir, "style.css")))
    out = "\n".join(styles)
    outfile = os.path.join(tgt_dir, "style.css")
    print "Generated style: %s" % outfile
    write_text_file(outfile, out)
    return out


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


def load_yaml_file(path):
    with open(path, 'r') as stream:
        data = yaml.load(stream)
        return data

###############################################################################

path = "main.yaml"
data = load_yaml_file(path)
scaffold(data)
