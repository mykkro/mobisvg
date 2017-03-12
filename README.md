C-Tester
========

C-Tester is a platform for running small applications (games, questionaries, testing apps) on Web and mobile devices with Android. 

Requirements:
 * Cordova (6.4.0.)
 * Python 2.7+ (tools, scaffolding)


## Cordova Development Notes

### Howto: Create Release version of the Android build

 1. Generate a keystore (necessary for signing the APK):
    ```
    USAGE: keytool -genkey -v -keystore <keystoreName>.keystore -alias <Keystore AliasName> -keyalg <Key algorithm> -keysize <Key size> -validity <Key Validity in Days>
    ```
    Let's name our keystore ```ctester-mobileapps``` with alias ```ctestermobileapps```:
    ```
    keytool -genkey -v -keystore ctester-mobileapps.keystore -alias ctestermobileapps -keyalg RSA -keysize 2048 -validity 10000
    ```
    Keytool will ask for some information:
    ```
    Enter keystore password:  ******
    Re-enter new password: ******
    What is your first and last name?
      [Unknown]:  C-Tester
    What is the name of your organizational unit?
      [Unknown]:  C-Tester Team
    What is the name of your organization?
      [Unknown]:  C-Tester Team
    ...

    Generating 2048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 10000 days
    ...
    [Storing ctester-mobileapps.keystore]
    ```
 2. place generated keystore to target directory and sign the generated APK
    ```
    # copy the keystore to the dir where the APKs are built
    cp ctester-mobileapps.keystore platforms/android/build/outputs/apk/ctester-mobileapps.keystore
    # change to the directory where the APKs are built
    cd platforms/android/build/outputs/apk
    # sign the APK
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ctester-mobileapps.keystore android-release-unsigned.apk ctestermobileapps
    ```
    The following warning may show:
    ```
    Warning:
    No -tsa or -tsacert is provided and this jar is not timestamped. Without a timestamp, users may not be able to validate this jar after the signer certificate's expiration date (2044-07-28) or after any future revocation date.
    ```
 3. use zipalign tool to optimize generated APK
    ```
    # path to build tools directory may be something like:
    # c:/Users/<USER>/AppData/Local/Android/sdk/build-tools/25.0.1/
    <BUILDTOOLSDIR>/zipalign -v 4 android-release-unsigned.apk ctester-release.apk
    ```
    It should end with a message:
    ```
    Verification successful!
    ```
 4. deploy the apk to the device
    ```
    cordova run android --release --nobuild
    ```
All steps done! The release build of the application is deployed on the device.



