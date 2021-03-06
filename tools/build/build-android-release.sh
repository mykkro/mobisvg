#!/bin/bash

METAFILE="main.yaml"
MASTERPREFIX="kote"
VERSION=`cat version`

PROJECT="$1"
if [ -z "$1" ]
  then
    PROJECT="allgames"
fi

DEPLOY="$2"
if [ -z "$1" ]
  then
    DEPLOY=""
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

TARGETDIR="$ROOTDIR/platforms/android/build/outputs/apk"
KEYSTORENAME="ctester-mobileapps.keystore"
KEYSTOREALIAS="ctestermobileapps"
KEYSTOREPATH="$ROOTDIR/keystore/$KEYSTORENAME"
ZIPALIGNPATH="c:/apps/android/build-tools/25.0.2/zipalign.exe"
TARGETNAME="$MASTERPREFIX-$PROJECT-$VERSION-release.apk"
DISTDIR="$ROOTDIR/tools/build/target/$VERSION"

KEYSTOREPASS=`cat $ROOTDIR/keystore/keystorepass`


# clear the APK directory
rm -rf $TARGETDIR
mkdir $TARGETDIR

# this will generate file platforms/android/build/outputs/apk/android-release-unsigned.apk
cordova build android --release

# copy the keystore to the dir where the APKs are built
cp $KEYSTOREPATH $TARGETDIR/$KEYSTORENAME

# change to the directory where the APKs are built
cd $TARGETDIR

# sign the APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $KEYSTORENAME -storepass $KEYSTOREPASS android-release-unsigned.apk $KEYSTOREALIAS

# use zipalign tool to optimize generated APK
$ZIPALIGNPATH -v 4 android-release-unsigned.apk $TARGETNAME

# copy to dist directory
mkdir -p $DISTDIR
cp $TARGETDIR/$TARGETNAME $DISTDIR/$TARGETNAME

if [ -n "$DEPLOY" ]
  then
	# deploy to the device
	cordova run android --release --nobuild
fi

# change back to the original dir
cd $CWD
