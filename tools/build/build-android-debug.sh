#!/bin/bash

METAFILE="main.yaml"
VERSION=`cat version`

PROJECT="$1"
if [ -z "$1" ]
  then
    PROJECT="allgames"
fi

# Make release build of selected project
ROOTDIR="/cygdrive/c/Work/mobisvg"
CWD=$(pwd)

# 1. scaffold the app
./scaffold.sh $METAFILE $PROJECT "$ROOTDIR/tools/build/config/$PROJECT"

# 2. generate and copy config.xml
CONFIGFILE="config/$PROJECT/config.json"
python generate_config.py $CONFIGFILE
cp config.xml $ROOTDIR/config.xml

# 3. Android build
cd "$ROOTDIR"
cordova run android

# change back to the original dir
cd $CWD