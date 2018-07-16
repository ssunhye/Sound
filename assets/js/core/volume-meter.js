function createAudioMeter(audioContext) {
	var processor = audioContext.createScriptProcessor(512);
	processor.onaudioprocess = volumeAudioProcess;
	processor.volume = 0;

	processor.connect(audioContext.destination);

	processor.shutdown =
		function(){
			this.disconnect();
			this.onaudioprocess = null;
		};

	return processor;
}

function volumeAudioProcess( event ) {
	var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
	var sum = 0;
    var x;

	if(bufLength!=0){
		for (var i=0; i<bufLength; i++) {
			x = buf[i];
			sum += x * x;
		}

		var rms =  Math.sqrt(sum / bufLength/2);
		if(rms!=0){
			var decibel = 20*(Math.log10(rms/0.000002));		
			this.volume = rms;
		}
	}
}