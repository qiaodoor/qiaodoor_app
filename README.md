qiaodoor_app
============
STEP 1: meteor installation
  sudo apt-get install --yes openjdk-7-jdk lib32z1 lib32stdc++6 git
  curl https://install.meteor.com/ | sh
  meteor install-sdk android // the process would hang at end terminate it is fine
  fix_meteor_bugs
    ~/.meteor/packages/meteor-tool/1.0.35/meteor-tool-os.linux.x86_32/tools/commands-cordova.js
    Line 2053:  Console.debug("Found AVDS:", avds);
                return ['meteor']; //FIXME: avds;
    Line 2079:  if (currentApi == findApi){ //FIXME && abi == findArch) {
    Line 2758:  result = { acceptable: true }; // FIXME
                return result;

STEP 2: configure linux shell
  echo "ANDROID_HOME=~/.meteor/android_bundle/android-sdk"  >> ~/.profile
  echo "ANT_HOME=~/.meteor/android_bundle/apache-ant-1.9.4" >> ~/.profile
  echo "PATH=$PATH:$ANT_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:~/.meteor/packages/meteor-tool/.1.0.35.hgbesu++os.linux.x86_32+web.browser+web.cordova/meteor-tool-os.linux.x86_32/dev_bundle/bin" >> ~/.profile
  source ~/.profile
  
STEP 3: play meteor by following: https://www.meteor.com/try

STEP 4: add cordova plugin into project
  meteor add cordova:com.qiaodoor.cordova.audiolet@https://github.com/qiaodoor/audiolet/tarball/d05a5cac302177ba3f09fadac8bd38b3fab447fe 
  //the version number d05a5cac302177ba3f09fadac8bd38b3fab447fe can be found from github
  
STEP 5: support mobile application development
  meteor add-platform android
  adb disconnect
  adb connect 192.168.0.100:5555 //TODO: install WifiADB into android cell phone and turn it on
  
  meteor deploy  qiaodoor.meteor.com
  meteor run android-device -p 3000 --mobile-server http://qiaodoor.meteor.com --production --verbose
  meteor run android-device -p 3000 --mobile-server http://www.qiaodoor.com    --production --verbose
  meteor run android-device -p 3000 --mobile-server http://192.168.0.102:3000  --production --verbose
      
STEP 6: customize mobile application
  project/mobile-config.js
  
===============================
cordova application development
===============================
STEP 1: install cordova CLI
  sudo npm install -g cordova

STEP 2: make android platform installed

STEP 3: create app
  cordova create qiaodoor_app com.qiaodoor.app QiaoDoor
  
STEP 4: add platform
  cd qiaodoor_app
  cordova platform add android
    
STEP 5: build
  cordova build
  
STEP 6: connect to android
  adb disconnect
  adb connect 92.168.0.102:5555
  
STEP 7: run the application
  cordova run

STEP 8: install plugman
  npm install -g plugman
  
STEP 9: create a plugin
  plugman create --name AudioLet --plugin_id com.qiaodoor.cordova.audiolet --plugin_version 0.0.1 --path qiaodoor_plugins
  
STEP A: add platform for plugin
  cd qiaodoor_plugins/AudioLet
  plugman platform add --platform_name android
  mkdir src/android/com/qiaodoor/cordova/audiolet -p
  mv src/android/AudioLet.java src/android/com/qiaodoor/cordova/audiolet
  update plugin.xml
    <clobbers target="AudioLet" />
    <source-file src="src/android/com/qiaodoor/cordova/audiolet/AudioLet.java" target-dir="src/com/qiaodoor/cordova/audiolet/AudioLet" />
    
STEP B: add the plugin to app
  cd ../..    
  cordova plugin add qiaodoor_plugins/AudioLet
  
STEP C: adding test code for the plugin
  update www/js/index.js

STEP D: run it again
  cordova build
  cordova run

STEP E: create customized icon for the app
  place the application logo icon under res and update config.xml
  
STEP F: add customized resources(e.g.:css) for different platform
  merges/android/css/overrides.css
  meanwhile add an empty to www/css/overrides.css

STEP G: create android project from existing code qiaodoor_app/platforms/android  
  create code link into .project
    <link>
		<name>audiolet</name>
		<type>2</type>
		<location>$%7BPARENT-2-PROJECT_LOC%7D/qiaodoor_plugins/AudioLet/src/android</location>
	</link>
	<link>
		<name>audiolet.js</name>
		<type>2</type>
		<location>$%7BPARENT-2-PROJECT_LOC%7D/qiaodoor_plugins/AudioLet/www</location>
	</link>
  create execlude into .classpath
    <classpathentry excluding="com/qiaodoor/cordova/audiolet/" kind="src" path="src"/>    
  after update code in eclipse need
    cordova plugin remove com.qiaodoor.cordova.audiolet
    cordova plugin add    qiaodoor_plugins/AudioLet
    cordova build

 