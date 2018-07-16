var audioContext = null;
var meter = null;

window.onload = function() {
    try{
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
	    audioContext = new AudioContext();
    }catch(e){
        this.alert('Web Audio API is not supported in this browser');
    }

    try {
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;

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
var desc=null;

function gotStream(stream) {
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);
    data=meter.volume;
    // data=meter.volume.toFixed(3);

    Plotly.plot('chart',[{
        y:[data],
        type:'line'
    }]);


    Plotly.plot('chart2',[{
        y:[data],
        type:'line'
    }]);

    setInterval(function(){
        //data=meter.volume.toFixed(3);
        data=meter.volume;

        if(data<10){
            desc="숨쉬는 소리";
        }
        else if(data<20){
            desc="나뭇잎 스치는 소리";
        }
        else if(data<30){
            desc="속삭이는 소리";
        }
        else if(data<40){
            desc="조용한 도서관";
        }
        else if(data<50){
            desc="조용한 사무실";
        }
        else if(data<60){
            desc="보통 대화소리";
        }
        else if(data<70){
            desc="진공청소기 소리";
        }
        else if(data<80){
            desc="시끄러운 음악";
        }
        else if(data<90){
            desc="잔디깎기 소리";
        }
        else if(data<100){
            desc="모터사이크 소리";
        }
        else if(data<110){
            desc="콘서트";
        }
        else{
            desc="고통을 주는 소음, 천둥";
        }

        document.getElementById("desc").innerHTML = desc;
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
    },200);
}