#!/bin/bash

# Make release build of selected project

METAFILE="main.yaml"
PROJECTNAME="entertainment"

ROOTDIR="/cygdrive/c/Work/mobisvg"

CWD=$(pwd)

# 1. scaffold the app
cd "$ROOTDIR/tools/scaffold"

python scaffold.py $METAFILE $PROJECTNAME

# 2. browser build
cd "$ROOTDIR"

cordova run browser

# change back to the original dir
cd $CWD