#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os, sys
from PIL import Image
import PIL.ImageOps
import json

# Tileset generator for the game 'Fifteen'

srcImagePath = "media/fifteen-tiles.png"
targetDir = "target/fifteen"
tilesetType = 'fifteen'
tilesetTitle = "Default Fifteen tileset"
tilesetName = "fifteenTileset"
tilesetVersion = "1.0"
x = 0
y = 0
width = 1024
height = 1024
prefix = "tile"
gridRows = 4
gridCols = 4

tileWidth = int(width/gridRows)
tileHeight = int(height/gridRows)
image = Image.open(srcImagePath)

def cut_image(x, y, tileWidth, tileHeight, gridRows, gridCols):
    tiles = []
    ndx = 0
    for i in range(0, gridRows):
        ty = y + i * tileHeight
        for j in range(0, gridCols):
           tx = x + j * tileWidth
           tile = image.crop((tx, ty, tx + tileWidth, ty + tileHeight))
           tilename = "%s%03d" % (prefix, ndx)
           tiles.append((tile, tilename))
           ndx += 1
    return tiles


tileset = {
  "$type": "playonweb-%s-tileset" % tilesetType,
  "name": tilesetName,
  "title": tilesetTitle,
  "version": tilesetVersion,
  "tiles": []
}
tiles = cut_image(x, y, tileWidth, tileHeight, gridRows, gridCols)
if not os.path.exists(targetDir):
    os.mkdir(targetDir)
for tile in tiles:
    img = tile[0]
    name = tile[1]
    filename = "%s.png" % name
    path = os.path.join(targetDir, filename)
    img.save(path)
    tileset["tiles"].append({
        "name": name,
        "url": filename
    })

with open(os.path.join(targetDir, "tileset.json"), "w") as outfile:
    json.dump(tileset, outfile, indent=4)

print "Tileset generated at %s!" % targetDir