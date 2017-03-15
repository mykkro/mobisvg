#!/usr/bin/env python
# -*- coding: utf-8 -*-

from jinja2 import Environment, FileSystemLoader
import os, json, sys

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
