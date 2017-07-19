#!/bin/bash

for f in `ls config`; do 
	PKGNAME=$f
	./build-browser.sh $PKGNAME
	./build-docker.sh $PKGNAME
	./build-android-release.sh $PKGNAME
done

