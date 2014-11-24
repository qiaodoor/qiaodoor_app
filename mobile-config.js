// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.qiaodoor.app',
  version : '0.0.1' ,
  name: 'Qiao Door',
  description: 'Qiao Door Mobile Application',
  author: 'Qiao Door Group',
  email: 'fuyinhai@gmail.com',
  website: 'http://www.qiaodoor.com'
});

// Set up resources such as icons and launch screens.
App.icons({
  //'iphone': 'icons/icon-60.png',
  //'iphone_2x': 'icons/icon-60@2x.png',
  'android_ldpi'     : 'icons/icon.png',
  'android_mdpi'     : 'icons/icon.png',
  'android_hdpi'     : 'icons/icon.png',
  'android_xhdpi'    : 'icons/icon.png',
});

App.launchScreens({
  //'iphone': 'splash/Default~iphone.png',
  //'iphone_2x': 'splash/Default@2x~iphone.png',
  'android_ldpi_landscape' :  'splash/ldpi_landscape.splash.png' ,
  'android_mdpi_portrait'  :  'splash/mdpi_portrait.splash.png'  , 
  'android_mdpi_landscape' :  'splash/mdpi_landscape.splash.png' , 
  'android_hdpi_portrait'  :  'splash/hdpi_portrait.splash.png'  , 
  'android_hdpi_landscape' :  'splash/hdpi_landscape.splash.png' , 
  'android_xhdpi_portrait' :  'splash/xhdpi_portrait.splash.png' , 
  'android_xhdpi_landscape':  'splash/xhdpi_landscape.splash.png'
});

App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('SplashScreenDelay', 1000);
App.setPreference('AutoHideSplashScreen',true);
