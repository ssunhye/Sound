var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH=500;
var HEIGHT=50;
var rafID = null;

window.onload = function() {
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}

function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;
var data=0;
var cnt = 0;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);
    data=meter.volume.toFixed(3);

    // kick off the visual updating
    
    Plotly.plot('chart',[{
        y:[data],
        type:'line'
    }]);


    Plotly.plot('chart2',[{
        y:[data],
        type:'line'
    }]);

    setInterval(function(){
        data=meter.volume.toFixed(3);

        document.getElementById("show").innerHTML = data;
        Plotly.extendTraces('chart',{y:[[data]]}, [0]);
        ++cnt;
    
        if(cnt>40){
            Plotly.relayout('chart',{
                xaxis: {
                    range: [cnt-40,cnt]
                }
            })
        }

        Plotly.extendTraces('chart2',{y:[[data]]}, [0]);
    },0);

}