#!/usr/bin/env python
# -*- coding: utf-8 -*-

from jinja2 import Environment, FileSystemLoader
import os, json, sys
import shutil

def render(tpl_path, context):
    path, filename = os.path.split(tpl_path)
    return Environment(
        loader=FileSystemLoader(path or './')
    ).get_template(filename).render(context)

TMPL = "skel/config.xml"
SRC = sys.argv[1]

with open(SRC) as data_file:
    context = json.load(data_file)

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



