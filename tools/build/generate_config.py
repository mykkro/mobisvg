#!/usr/bin/env python
# -*- coding: utf-8 -*-

from jinja2 import Environment, FileSystemLoader
import os, sys
import shutil
import simplejson as json

def render(tpl_path, context):
    path, filename = os.path.split(tpl_path)
    return Environment(
        loader=FileSystemLoader(path or './')
    ).get_template(filename).render(context)

TMPL = "skel/config.xml"
SRC = sys.argv[1]

print "Reading configuration from %s" % SRC
with open(SRC) as data_file:
    context = json.load(data_file)

with open('version', 'r') as myfile:
    version = myfile.read().strip()

# ovwerride version from JSON by version in version file
context["version"] = version

result = render(TMPL, context)

with open("config.xml", "w") as text_file:
    text_file.write(result.encode("utf-8"))

# copy icons...
icon = context.get("icon", "kote")
src_dir = "../scaffold/icons/%s" % icon
print "Copying icons from %s" % src_dir
dirs = ["mipmap-ldpi", "mipmap-xhdpi", "mipmap-hdpi", "mipmap-mdpi"]
for dd in dirs:
    src_file = os.path.join(src_dir, dd, "icon.png")
    dst_file = os.path.join("../../platforms/android/res", dd, "icon.png")
    shutil.copy(src_file, dst_file)

# TODO update res/values-en/strings.xml and res/values-cz/strings.xml
strings = context.get("strings")
for loc in strings:
    app_name = strings[loc]["app_name"]
    xml = """<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">%s</string>
    <string name="launcher_name">@string/app_name</string>
    <string name="activity_name">@string/launcher_name</string>
</resources>""" % app_name
    path = os.path.join("../../platforms/android/res", "values-%s" % loc, "strings.xml")
    with open(path, "wb") as outfile:
        outfile.write(xml.encode("UTF-8"))

