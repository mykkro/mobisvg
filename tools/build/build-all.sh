#!/bin/bash

for f in `ls config`; do 
	CONFNAME=${f%.json}
	PKGNAME=${CONFNAME#config-}
	./build-browser.sh $PKGNAME
	./build-android-release.sh $PKGNAME
done

