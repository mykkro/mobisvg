#!/bin/bash

METAFILE="main.yaml"
PROJECT="$1"
if [ -z "$1" ]
  then
    PROJECT="allgames"
fi

# Make release build of selected project
ROOTDIR="/cygdrive/c/Work/mobisvg"
CWD=$(pwd)

# 1. scaffold the app
./scaffold.sh $METAFILE $PROJECT

# 2. browser build
cd "$ROOTDIR"
cordova run browser

# change back to the original dir
cd $CWD