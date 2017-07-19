#!/bin/bash

# USAGE:
#  build-browser.sh PACKAGENAME - builds package

METAFILE="main.yaml"
MASTERPREFIX="kote"
VERSION=`cat version`


PROJECT="$1"
if [ -z "$1" ]
  then
    PROJECT="allgames"
fi


ROOTDIR="/cygdrive/c/Work/mobisvg"
SRCDIR="$ROOTDIR/platforms/browser/www"
TARGETNAME="$MASTERPREFIX-$PROJECT-$VERSION-web"
DISTDIR="$ROOTDIR/tools/build/target/$VERSION"
TMPDIR="$ROOTDIR/tools/build/tmp"

CWD=$(pwd)

# 1. scaffold the app
./scaffold.sh $METAFILE $PROJECT "$ROOTDIR/tools/build/config/$PROJECT"

# 2. browser build
cd "$ROOTDIR"
cordova build browser

# prepare zip file
rm -rf $TMPDIR/$TARGETNAME
cp -r platforms/browser/www $TMPDIR/$TARGETNAME
cd $TMPDIR
mkdir -p $DISTDIR
zip -r $DISTDIR/$TARGETNAME.zip $TARGETNAME

# change back to the original dir
cd $CWD