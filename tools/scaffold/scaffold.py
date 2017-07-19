#!/usr/bin/env python

# -*- coding: utf-8 -*-

import os, sys, yaml, json
from shutil import copyfile, rmtree
from distutils.dir_util import copy_tree
import datetime
from time import mktime


SRCDIR = "."
TGTDIR = "../../www"


def get_project_data(data, project_name):
    for proj in data["projects"]:
        if proj["name"] == project_name:
            return proj
    return None


def scaffold(dir, out_dir, data, project_name, configdir):
    print "Scaffolding applications for project %s..." % project_name
    print "Using config directory with extra data: %s" % configdir
    print
    info = scaffold_framework_info(data)
    loc_index = scaffold_locales(dir, out_dir, data["locales"], configdir)
    project = get_project_data(data, project_name)
    apps_index = scaffold_apps(dir, out_dir, project["apps"])
    icon = scaffold_icon(dir, out_dir, project.get("icon", "kote"))
    settings = scaffold_global_settings(dir, out_dir, project.get("settings", {}))
    return {
        "info": info,
        "apps": apps_index,
        "locales": loc_index,
        "icon": icon,
        "settings": settings,
        "languages": scaffold_languages(dir, out_dir, project.get("languages", ['en']))
    }


def scaffold_languages(src_dir, out_dir, languages):
    print "Scaffolding languages", languages
    return languages


def scaffold_global_settings(src_dir, out_dir, settings):
    print "Scaffolding global settings", settings
    return settings


def scaffold_icon(dir, out_dir, icon_name):
    print "Scaffolding icon %s" % icon_name
    ## return copy_file_if_exists(os.path.join(src_dir, "preview.png"), os.path.join(out_dir, "preview.png"))
    return icon_name


def scaffold_locales(dir, out_dir, data, configdir=None):
    loc_index = []
    for loc in data:
        loc_index.append(
            scaffold_locale(os.path.join(dir, "locales"), os.path.join(out_dir, "locales"), loc, configdir)
        )
    return loc_index


def scaffold_gamepacks(dir, out_dir, data):
    gp_index = []
    for gp in data:
        gp_index.append(scaffold_gamepack(os.path.join(dir, "gamepacks"), os.path.join(out_dir, "gamepacks"), gp))
    return gp_index


def scaffold_assets(dir, out_dir):
    dir = os.path.join(dir, "assets")
    out_dir = os.path.join(out_dir, "assets")
    if os.path.isdir(dir):
        ensure_directory(out_dir)
        copy_tree(dir, out_dir)


def scaffold_apps(dir, out_dir, data):
    apps_index = []
    for app in data:
        apps_index.append(scaffold_app(os.path.join(dir, "apps"), os.path.join(out_dir, "apps"), app))
    return apps_index


def copy_file_if_exists(src_path, dst_path):
    if os.path.exists(src_path):
        copyfile(src_path, dst_path)
        return True
    return False


def scaffold_preview(src_dir, out_dir):
    return copy_file_if_exists(os.path.join(src_dir, "preview.png"), os.path.join(out_dir, "preview.png"))


def scaffold_config(src_dir, out_dir):
    src_path = os.path.join(src_dir, "config.yaml")
    if os.path.exists(src_path):
        dst_path = os.path.join(out_dir, "config.json")
        config = load_yaml_file(src_path)
        write_json_file(dst_path, config)
        return config
    return None


def scaffold_settings(src_dir, out_dir):
    src_path = os.path.join(src_dir, "settings.yaml")
    if os.path.exists(src_path):
        dst_path = os.path.join(out_dir, "settings.json")
        settings = load_yaml_file(src_path)
        write_json_file(dst_path, settings)
        return settings
    return None


def scaffold_locale(dir, out_dir, loc, configdir=None):
    # if configdir is specified, load credits.yml from this directory
    index = {}
    name = loc.keys()[0]
    index["name"] = name
    locale = loc.values()[0] or []

    dir = os.path.join(dir, name)
    out_dir = os.path.join(out_dir, name)
    ensure_directory(out_dir)

    # scaffold metadata
    out_path = os.path.join(out_dir, "metadata.json")
    index["metadata"] = scaffold_metadata(locale, out_path, language=name)

    # scaffold translations
    path = os.path.join(dir, "translations.yaml")
    if os.path.exists(path):
        out_path = os.path.join(out_dir, "translations.json")
        index["translations"] = scaffold_vocabulary(path, out_path, language=name)

    path = None
    if configdir:
        path = os.path.join(configdir, "locales", name, "credits.yaml")    
        # print path
        if os.path.exists(path):
            print "Extra credits located: %s" % path
        else:
            path = None

    path = path or os.path.join(dir, "credits.yaml")
    if os.path.exists(path):
        out_path = os.path.join(out_dir, "credits.json")
        index["credits"] = scaffold_credits(path, out_path, language=name)

    # copy preview.png if it exists
    index["preview"] = scaffold_preview(dir, out_dir)

    # copy assets if any
    scaffold_assets(dir, out_dir)

    return index


def scaffold_gamepack(dir, out_dir, gp):
    index = {}
    name = gp["name"]
    index["name"] = name
    locales = gp.get("locales", []) or []
    resources = gp.get("resources", {}) or {}

    dir = os.path.join(dir, name)
    out_dir = os.path.join(out_dir, name)
    ensure_directory(out_dir)
    print "Scaffolding gamepack %s" % name

    # scaffold locales
    index["locales"] = scaffold_locales(dir, out_dir, locales, None)

    # scaffold resources
    index["resources"] = scaffold_resources(dir, out_dir, resources)

    # copy preview.png if it exists
    index["preview"] = scaffold_preview(dir, out_dir)

    # read config.yaml if it exists
    index["config"] = scaffold_config(dir, out_dir)

    # read settings.yaml if it exists
    index["settings"] = scaffold_settings(dir, out_dir)

    # copy assets if any
    scaffold_assets(dir, out_dir)

    return index


def scaffold_resources(dir, out_dir, resources):
    print "Scaffolding resources"
    res = {}
    for r in resources:
        for key in r:
            res[key] = r[key]
    return res


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
    return out


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
        return data


def scaffold_credits(path, out_path, language="en", version="1.0"):
    # generate credits.json
    print "Generating credits.json"
    with open(path, 'r') as stream:
        data = yaml.load(stream)
        vocab = {
            "$type": "playonweb-credits",
            "version": version,
            "language": language,
            "credits": data
        }
        put_json_file(out_path, vocab)
        return data


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
def scaffold_app(dir, out_dir, app):
    index = {}
    app_name = app["name"]
    index["name"] = app_name
    index["gamepackName"] = app["gamepack"] or "default"

    dir = os.path.join(dir, app_name)
    out_dir = os.path.join(out_dir, app_name)
    app_yaml = load_yaml_file(os.path.join(dir, "app.yaml"))
    print "Loaded app data: %s" % app_name, app_yaml

    out_root = out_dir

    index["locales"] = scaffold_locales(dir, out_root, app_yaml.get("locales", []) or [], None)

    index["gamepacks"] = scaffold_gamepacks(dir, out_root, app_yaml.get("gamepacks", []) or [])

    # scaffold resources
    index["resources"] = scaffold_resources(dir, out_dir, app_yaml.get("resources", {}) or {})

    # generate script.js
    scaffold_script(dir, out_root, app_yaml.get("scripts", []) or [])

    # generate style.css
    scaffold_style(dir, out_root, app_yaml.get("styles", []) or [])

    # copy preview.png if it exists
    index["preview"] = scaffold_preview(dir, out_root)

    # copy assets if any
    scaffold_assets(dir, out_root)

    # read config.yaml if it exists
    index["config"] = scaffold_config(dir, out_dir)

    # read settings.yaml if it exists
    index["settings"] = scaffold_settings(dir, out_dir)

    index["tags"] = app.get("tags", app_yaml.get("tags", [])) or []
    index["gameClass"] = app_yaml["game_class"]

    return index


def load_text_file(path):
    with open(path, 'r') as myfile:
        data = myfile.read()
        return data


def write_text_file(path, text):
    with open(path, 'w') as myfile:
        myfile.write(text)


def write_json_file(path, data):
    with open(path, 'w') as myfile:
        json.dump(data, myfile, indent=4)


def scaffold_script(src_dir, tgt_dir, script_list=[]):
    # there should be always script.js in src_dir
    scripts = []
    for sc in script_list:
        scripts.append(load_text_file(os.path.join(src_dir, sc)))
    scripts.append(load_text_file(os.path.join(src_dir, "script.js")))
    out = "\n".join(scripts)
    outfile = os.path.join(tgt_dir, "script.js")
    write_text_file(outfile, out)


def scaffold_style(src_dir, tgt_dir, style_list=[]):
    # there should be always style.css in src_dir
    styles = []
    for sc in style_list:
        styles.append(load_text_file(os.path.join(src_dir, sc)))
    styles.append(load_text_file(os.path.join(src_dir, "style.css")))
    out = "\n".join(styles)
    outfile = os.path.join(tgt_dir, "style.css")
    write_text_file(outfile, out)


def scaffold_framework_info(data):
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
    return {
        "doctype": data.get("doctype"),
        "version": data.get("version"),
        "last_update": data.get("last_update")
    }


def load_yaml_file(path):
    with open(path, 'r') as stream:
        data = yaml.load(stream)
        return data

###############################################################################

path = "main.yaml"
project = "allgames"
configdir = None

if len(sys.argv) > 1:
    path = sys.argv[1]
    if len(sys.argv) > 2:
        project = sys.argv[2]
        if len(sys.argv) > 3:
            configdir = sys.argv[3]

data = load_yaml_file(path)

dir = SRCDIR
out_dir = TGTDIR
apps_dir = os.path.join(TGTDIR, "apps")
rmtree(apps_dir)
os.mkdir(apps_dir)
index = scaffold(dir, out_dir, data, project, configdir)
print index


json.JSONEncoder.default = lambda self,obj: (obj.isoformat() if isinstance(obj, datetime.datetime) else None)

json_str = json.dumps(index, indent=4)
write_text_file(os.path.join(out_dir, "index.json"), json_str)
