var exec = require('cordova/exec');

exports.wavPlay = function(command, sampleHz, sampleBytes, jitterInitialized , success, error) {
    exec(success, error, "AudioLet", "wavPlay", [command, sampleHz, sampleBytes, jitterInitialized]);
};
