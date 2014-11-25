package com.qiaodoor.cordova.audiolet;

import java.util.ArrayList;
import java.util.List;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;

/**
 * This class echoes a string called from JavaScript.
 */
public class AudioLet extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (action.equals("wavPlay")) { 
        	if (args.length() < 4 ) {
        		callbackContext.error("expected: wavPlay(command, sampleHz, sampleBytes , jitterInitialized)");
        	} else { 
        		final String command  = args.getString(0);
        		final int sampleHz    = args.getInt(1);
        		final int sampleBytes = args.getInt(2);
        		final int jitterInitialized
        		                = args.getInt(3);
        		
        		String[] tokens = (""+command).toUpperCase().split("[|]");
    			if ( tokens.length < 4) {
    				callbackContext.error("expected command should follow pattern: commandName|repeatTimes|duration1|duration2|...|durationN|012...");
    			} else {
    				cordova.getThreadPool().execute(new Runnable() {
						@Override
						public void run() {
		    				doWavPlay(command, sampleHz, sampleBytes, jitterInitialized); 
		    				callbackContext.success( "finished" );
						}    					
    				});
    				return true ;
    			}
        	}
        }
        return false;
    }
    
    /**
     * convert given command to audio leftChannel and rightChannel keep them has differences
     * <pre>
     * e.g.: command e.g.: 0E07|3|80|30|20|0101010121211111111111111111
     * commandName: 0E07
     * repeatTimes: 3
     * duration: 80 (=80*20=1600 uS)
     * duration: 30 (=30*20=600 uS)
     * duration: 20 (=20*20=400 uS)
     * 0101010121211111111111111111: mark[80] space[30] mark[80] space[30] mark[80] space[30] mark[80] space[30] mark[20] ......
     * mark: leftChannel volume high than rightChannel
     * space: leftChannel volume low than rightChannel
     * </pre> 
     * @param command: the command
     * @param sampleHz: the audioPlay candidate HZ
     * @param sampleBytes: 1 or 2 bytes per sample
     * @param jitterInitialized: make the HIGH/LOW audio jump otherwise some hardware would block the line wave play
     */
    public void doWavPlay(String command, int sampleHz, int sampleBytes , int jitterInitialized) {
		// STEP 1: retrieve the base points and signal sequence
		List<Integer> points= new ArrayList<Integer>();
		int numOfPoints     = 0 ;
		int times           = 1 ;
		{
			List<Integer> basePoints  = new ArrayList<Integer>();
			String[] tokens = (""+command).toUpperCase().split("[|]");
			
			times = Integer.valueOf(tokens[1]);
			if (times <= 0) {
				times = 1 ;
			}
			for (int idx=2; idx < tokens.length - 1 ; idx ++) {
				basePoints.add( Integer.parseInt(tokens[idx])) ; 
			} 
			
			char[] signalChars = tokens[tokens.length -1].toCharArray();
			for (int idx=0; idx < signalChars.length; idx ++) {
				int iCode = signalChars[idx] <= '9' ? (signalChars[idx] - '0') : (signalChars[idx] - 'A' + 10) ;
				if (iCode >=0 && iCode < basePoints.size()) {
					// point = basePoints.get(iCode) * 20 * 48000 / 1000000;
					int point = basePoints.get(iCode) * sampleHz / 50000;
					points.add( point ) ;
					numOfPoints += point;
				}
			}
		}
		
		// STEP 2: build high low wave points by using signal sequence
		int logicHigh = ((int)( Math.pow(2, ( sampleBytes * 8 - 0 ))) - jitterInitialized * 2 );
		int logicLow  = jitterInitialized ;
		if (sampleBytes == 2) {
			logicHigh = ((int)( Math.pow(2, ( sampleBytes* 8 - 1 ))) - jitterInitialized * 2 ) ;
			logicLow  = jitterInitialized;
		}
		
        byte[] waveForm = new byte[numOfPoints*sampleBytes*2];
        int jitter      = 0 ;
        int n           = 0 ;
        
		for (int idx=0; idx < points.size(); idx ++) {
			for ( int ndx=0; ndx < points.get(idx) ; ndx ++) {
				int volLeft  = ( idx % 2 == 0 ? logicHigh:logicLow ) + jitter;
				int volRight = ( idx % 2 == 1 ? logicHigh:logicLow ) + jitter;
				jitter = (jitter==0)?jitterInitialized:0;
				
				for ( int s=0; s<sampleBytes; s++) {
					waveForm[n + s] = (byte)(volLeft >> (s * 8)) ;
				}
				for ( int s=0; s<sampleBytes; s++) {
					waveForm[n + sampleBytes + s] = (byte)(volRight >> (s * 8)) ;
				}
				n += sampleBytes * 2 ;
			}
		}
		
		byte[] audioBuffer = new byte[ times * waveForm.length] ;
		for (int idx=0; idx < times; idx ++) {
			System.arraycopy(waveForm, 0, audioBuffer, idx*waveForm.length, waveForm.length);
		}
		 
    	// STEP 3: prepare the AudioTrack
    	int bufferSize= AudioTrack.getMinBufferSize( sampleHz
    			, AudioFormat.CHANNEL_OUT_STEREO 
    			, sampleBytes == 2 ? AudioFormat.ENCODING_PCM_16BIT : AudioFormat.ENCODING_PCM_8BIT );
    	
		AudioTrack audioTrack = new AudioTrack( AudioManager.STREAM_MUSIC 
				, sampleHz 
				, AudioFormat.CHANNEL_OUT_STEREO 
				, sampleBytes == 2 ? AudioFormat.ENCODING_PCM_16BIT : AudioFormat.ENCODING_PCM_8BIT
				, bufferSize 
				, AudioTrack.MODE_STREAM );	
		audioTrack.setStereoVolume(1.0F, 1.0F); 
		audioTrack.play() ;
		
		byte[] emptyBuffer   = new byte[bufferSize];
		audioTrack.write(emptyBuffer, 0, emptyBuffer.length);
		audioTrack.flush();
		
    	// STEP 5: play the buffer 
		if ( audioBuffer.length <=bufferSize ) {
			byte[] newBuffer = new byte[bufferSize]; 
			System.arraycopy(audioBuffer, 0, newBuffer, 0 , audioBuffer.length); 
			audioBuffer = newBuffer ;
			audioTrack.write(audioBuffer, 0, audioBuffer.length);
			audioTrack.flush();  
		}  else {
			n = audioBuffer.length / bufferSize ;
			for ( int idx=0; idx < n ; idx ++) {
				audioTrack.write(audioBuffer, idx*bufferSize, bufferSize);
				audioTrack.flush();  
			}
			byte[] newBuffer = new byte[bufferSize]; 
			System.arraycopy(audioBuffer, n*bufferSize , newBuffer, 0 , audioBuffer.length % bufferSize);  
			audioTrack.write(newBuffer, 0, newBuffer.length);
			audioTrack.flush(); 
		} 

		// STEP 6: wait for a while until the audio play finish
		int msWaitted = bufferSize / ( sampleBytes * (sampleHz/500) ) ;
		try {
			Thread.sleep(msWaitted);
		} catch (InterruptedException e) { 
		}
		
		audioTrack.stop();
		audioTrack.release();
		
    }
}
