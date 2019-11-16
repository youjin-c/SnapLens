// GameCoGUIController.js
// Event: Lens Initialized
// Description: Turn on/off GUI elements 

//@input Component.ManipulateComponent[] holeManComponents
//@input SceneObject[] GUI_items
//@input Component.MeshVisual touchEventTouchTarget
//@input Component.AudioComponent whistle
//@input Component.AudioComponent background

script.GUI_items[0].enabled=false;
script.GUI_items[1].enabled=true;


function safeGetComponent(obj, componentType) {
    return (obj.getComponentCount(componentType) > 0) ? obj.getFirstComponent(componentType) : null;
}

function getOrAddComponent(obj, componentType) {
    return safeGetComponent(obj, componentType) || obj.createComponent(componentType);
}

//Set a touch event for 'START GAME' image button
function setupTouchEvent() {
    var targetScript = script;
    if (script.touchEventTouchTarget) {
        var targetObj = script.touchEventTouchTarget.getSceneObject();
        var touchComponent = getOrAddComponent(targetObj, "Component.TouchComponent");
        touchComponent.addMeshVisual(script.touchEventTouchTarget);
        targetScript = targetObj.createComponent("Component.ScriptComponent");
    }
    targetScript.createEvent("TapEvent").bind(gameStart);
}
setupTouchEvent();


function gameStart() {
    //After game starts, the holes shouldn't moved anymore.
    for (var i = 0; i < script.holeManComponents.length; i++) {
        script.holeManComponents[i].destroy();
    }
    script.GUI_items[0].enabled=true;
    script.GUI_items[1].enabled=false;
    //Start game sounds
    global.whistle = script.whistle;
    global.whistle.play(1);

    //Give some delay to start game after the whistle blow sound.
    var delayedMusic = script.createEvent("DelayedCallbackEvent");
    delayedMusic.reset(1.5);
    delayedMusic.bind(function(eventData)
    {
        //background music
        global.background = script.background;
        global.background.play(1);

        //trigger functions in GameController.js
        global.updateEventCountdown = script.createEvent("UpdateEvent");
        global.updateEventCountdown.bind(function(eventData)
        {
            global.countdown(eventData);
        });
        global.surprise();
    });
}




