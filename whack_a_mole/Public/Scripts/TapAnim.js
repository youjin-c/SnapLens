// TapAnim.js
// Version: 0.0.4
// Event: Lens Initialized
// Description: Plays a single animation on the character when they are tapped

//  @ui {"widget": "group_start", "label": "Tap Animation Settings"}

//  @input string tapAnimLayer
//  @input int tapLoops

//  @ui {"widget": "group_end"}

//  @input Asset.AudioTrackAsset tapAnimAudio
// @input Component.AudioComponent jump

var tapAnimLayerPlaying = false;
var audioComponentTap = null;

// Setup the audio component if audio track defined
function audioSetup() {
    if (script.tapAnimAudio && !audioComponentTap) {
        audioComponentTap = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponentTap.audioTrack = script.tapAnimAudio;
    }
}
audioSetup();

// Function runs at start of lens
function onLensTurnOnEvent() {
    // Make sure to reset var in lens Turn On Event
    tapAnimLayerPlaying = false;
}
var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOnEvent);

function onTap(eventData) {
    //This function only gets tapped object. Jumping Animation function is down below.
    global.playItem = eventData.getSceneObject().getChild(0);
}

var tapEvent = script.createEvent("TapEvent");
tapEvent.bind(onTap);

function tapAnimEndCallback() {
    tapAnimLayerPlaying = false;
    script.api.animMixer.setWeight(script.tapAnimLayer, 0.0);
    stopTapAnimAudio(audioComponentTap);
    script.api.idleAnimInitFunc();
}

function playTapAnimAudio(audioComponent, loops) {
    if (audioComponent) {
        if (audioComponent.isPlaying()) {
            audioComponent.stop(false);
        }
        audioComponent.play(loops);
    }
}

function stopTapAnimAudio(audioComponent) {
    if (audioComponent) {
        if (audioComponent.isPlaying()) {
            audioComponent.stop(false);
        }
    }  
}

global.jumpAnimation = function(animMixer) {
    if (global.scene.getCameraType() == "back") {
        if (script.tapAnimLayer && script.tapAnimLayer != "" && animMixer) {
            animMixer.setWeight(script.api.idleAnimLayerName, 0.0);
            animMixer.startWithCallback(script.tapAnimLayer, 0, script.tapLoops, tapAnimEndCallback);
            animMixer.setWeight(script.tapAnimLayer, 1.0);

            if (script.api.idleAnimAudio && script.api.idleAnimAudio.isPlaying()) {
                script.api.idleAnimAudio.stop(false);
            }
            script.jump.play(1);
        }
    }
}