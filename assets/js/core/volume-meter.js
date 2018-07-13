function createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
	var processor = audioContext.createScriptProcessor(512);
	processor.onaudioprocess = volumeAudioProcess;
	processor.clipping = false;
	processor.lastClip = 0;
	processor.volume = 40;
	processor.clipLevel = clipLevel || 0.98;
	processor.averaging = averaging || 0.95;
	processor.clipLag = clipLag || 750;

	processor.connect(audioContext.destination);

	processor.checkClipping =
		function(){
			if (!this.clipping)
				return false;
			if ((this.lastClip + this.clipLag) < window.performance.now())
				this.clipping = false;
			return this.clipping;
		};

	processor.shutdown =
		function(){
			this.disconnect();
			this.onaudioprocess = null;
		};

	return processor;
}

var decibel =40;
var minDB = 100;
var maxDB=0;
var lastDB = decibel;
var min = 0.5;
var value = 0;

function volumeAudioProcess( event ) {
	var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
	var sum = 0;
    var x;

	// Do a root-mean-square on the samples: sum up the squares...
    for (var i=0; i<bufLength; i++) {
    	x = buf[i];
    	if (Math.abs(x)>=this.clipLevel) {
    		this.clipping = true;
    		this.lastClip = window.performance.now();
    	}
    	sum += x * x;
	}

    // ... then take the square root of the sum.
	var rms =  Math.sqrt(sum / bufLength);
	var decibel = 20*(Math.log10(rms/0.000002));
	// var dbValue = 20*(Math.log10(rms/0.000002));
	// if (dbValue>lastDB){
	// 	value = dbValue-lastDB > min ? dbValue - lastDB : min;
	// }else{
	// 	value = dbValue-lastDB < -min ? dbValue - lastDB : -min;
	// }
	// decibel = lastDB+value*0.2;
	// lastDB=decibel;
	// if(decibel<minDB) minDB=decibel;
	// if(decibel>maxDB) maxDB=decibel;

	this.volume = decibel;
}