#!/bin/bash

# USAGE:
#  run-browser.sh PACKAGENAME      - builds and runs web
#  run-browser.sh PACKAGENAME pkg  - builds package and runs web

METAFILE="main.yaml"
MASTERPREFIX="kote"
VERSION=`cat version`


PROJECT="$1"
if [ -z "$1" ]
  then
    PROJECT="allgames"
fi

MAKEPACKAGE="$2"
if [ -z "$2" ]
  then
    MAKEPACKAGE=""
fi


ROOTDIR="/cygdrive/c/Work/mobisvg"
SRCDIR="$ROOTDIR/platforms/browser/www"
TARGETNAME="$MASTERPREFIX-$PROJECT-$VERSION-web"
DISTDIR="$ROOTDIR/tools/build/target/$VERSION"
TMPDIR="$ROOTDIR/tools/build/tmp"

CWD=$(pwd)

# 1. scaffold the app
./scaffold.sh $METAFILE $PROJECT "$ROOTDIR/tools/build/config/$PROJECT"

if [ -n "$MAKEPACKAGE" ]
  then
	# 2. browser build
	cd "$ROOTDIR"
	cordova build browser

	# prepare zip file
	rm -rf $TMPDIR/$TARGETNAME
	cp -r platforms/browser/www $TMPDIR/$TARGETNAME
	cd $TMPDIR
	mkdir -p $DISTDIR
	zip -r $DISTDIR/$TARGETNAME.zip $TARGETNAME
fi

cd "$ROOTDIR"
cordova run browser

# change back to the original dir
cd $CWD