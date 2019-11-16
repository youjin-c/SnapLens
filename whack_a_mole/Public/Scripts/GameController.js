// GameController.js
// Event: Lens Initialized
// Description: Control the game system, including simple high score example

// @input Component.Text scoreText
// @input Component.Text highScoreText
// @input Component.Text countDownText
// @input Component.Text[] endText
// @input Component.Text fianlScoreText
// @input Component.AnimationMixer[] AnimationMixers
// @input SceneObject[] Confettis
// @input Component.AudioComponent point

var currentScore = 0;
var highScore = 0;
var countdownSeconds = 15;
var timer = 0;
var countdonwnFlag = false; //check timeout
var lastIdx;
var holeLength = 3; //# of moles/holes
for(var i =0; i < script.endText.length;i++){
    script.endText[i].enabled = false;
}
// Confetti Particle Varialbes
var meshVis;
var startTime;
// Define the key which the persistent storage system will use to save the data to
const highScoreKey = "hs_template_high_score";

// Get the data associated with the key from the persistent storage system
var persistentStorageSystem = global.persistentStorageSystem.store;
highScore = persistentStorageSystem.getFloat(highScoreKey) || 0;

// Update the high score label
updateHighScoreText();

// Script API interface
script.api.incrementScore = incrementScore;
script.api.endGame = endGame;

function updateFinalScoreText() {
    script.fianlScoreText.text = currentScore.toString();
}
function updateScoreText() {
    script.scoreText.text = currentScore.toString();
}
function updateHighScoreText() {
    script.highScoreText.text = highScore.toString();
}
function updateCountdownText(second) {
    script.countDownText.text = Math.ceil(second).toString();
}
function incrementScore() {
    currentScore++;
    updateScoreText();
}
function setHighScore() {
    if( currentScore > highScore ) {
        highScore = currentScore;
        // Set the data associated with the key from the persistent storage system
        persistentStorageSystem.putFloat(highScoreKey, currentScore);
        // Update the high score text since its been updated
        updateHighScoreText();
    }
}
function resetGame() {   
    currentScore = 0;
    updateScoreText();
}
function endGame() {
    updateFinalScoreText();
    setHighScore();
    resetGame();
}

//Whack-a-mole timing control funtions
function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
   }
function randomIdx(holeLength){
    var idx = Math.floor(Math.random() * holeLength);
    if(idx == lastIdx) {
        return randomIdx(holeLength);
    }
    lastIdx = idx;
    return idx;
}
//THIE SURPRISE FUNCTION: randomly choose a hole, let the mole jump. It counts the points also.
global.surprise =function() {
    randomtimer = randomTime(0.5, 1.2);
    const idx = randomIdx(holeLength);
    script.api.animMixer = script.AnimationMixers[idx];

    //Compares whether tapped object is the same with the current jumping object,
    var playItem = script.AnimationMixers[idx].getSceneObject();
    var tapItem = global.playItem;
    if(tapItem && playItem.isSame(tapItem)) {
        print("MATCH!!!");
        script.point.play(1);
        incrementScore();
        //for confetti
        startTime = getTime();
        meshVis = script.Confettis[idx].getFirstComponent("Component.MeshVisual");
    }

    global.jumpAnimation(script.api.animMixer); //randomly chosen mole jumps
    if(!countdonwnFlag){
        var delayedEvent = script.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(function(eventData)
        {
            surprise();
        });
        delayedEvent.reset(randomtimer);
    }
}
//TIMER FUNCTION FOR COUNTDOWN
global.countdown = function(eventData) { 
    countdownSeconds -= eventData.getDeltaTime();
    updateCountdownText(countdownSeconds);
    countdownCeiled = Math.ceil(countdownSeconds);
    if (countdownCeiled <= 0) { //time is up.
        countdonwnFlag = true;
        print("END");
        endGame();
        global.updateEventCountdown.enabled = false;
        global.surprise.enabled = false;
        for(var i =0; i < script.endText.length;i++){
            script.endText[i].enabled = true;
        }
        global.background.stop(false);
        global.whistle.play(1);
    }
    if (startTime) //use updateevent function to bursts confetti.
    {
        var particleTime = getTime() - startTime;
        meshVis.mainPass.externalTimeInput = particleTime*2; 
    }
}
