#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os, sys
from PIL import Image
import PIL.ImageOps
import json

# Tileset generator for the game 'Fifteen'

srcImagePath = "media/kote2.png"
targetDir = "target/kote2"

im = Image.open(srcImagePath)

dirs = [
    ("mipmap-hdpi", 72),
    ("mipmap-xhdpi", 96),
    ("mipmap-ldpi", 36),
    ("mipmap-mdpi", 48)
]

if not os.path.exists(targetDir):
    os.mkdir(targetDir)

for dir in dirs:
    iconDir = os.path.join(targetDir, dir[0])
    if not os.path.exists(iconDir):
        os.mkdir(iconDir)
    outfile = os.path.join(iconDir, "icon.png")
    im_resized = im.resize((dir[1], dir[1]), Image.ANTIALIAS)
    im_resized.save(outfile)
