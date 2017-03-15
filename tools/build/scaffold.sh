#!/bin/bash

# Make release build of selected project

METAFILE="$1"
PROJECTNAME="$2"

ROOTDIR="/cygdrive/c/Work/mobisvg"

# 1. scaffold the app
cd "$ROOTDIR/tools/scaffold"

python scaffold.py $METAFILE $PROJECTNAME
