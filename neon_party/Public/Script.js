//@input Component.Head head
//@input SceneObject light0
//@input SceneObject light1
//@input SceneObject light2

//get the initial rotations of the light objects
var rot0 = script.light0.getTransform().getLocalRotation();
var rot1 = script.light1.getTransform().getLocalRotation();
var rot2 = script.light2.getTransform().getLocalRotation();

var event = script.createEvent("UpdateEvent");

event.bind(function (eventData)
{
	//head position x controls the light rotation; the controller could be any position of tacking objects
	headPos = script.head.getTransform().getLocalPosition();
	var d2pos = new vec2(Math.abs(headPos.x), Math.abs(headPos.y)).normalize();

	//get the slerp of the route of light rotation
	var slerp0 =quat.slerp(rot1, rot2,d2pos.x);
	var slerp1 =quat.slerp(rot2, rot0,d2pos.x);
	var slerp2 =quat.slerp(rot0, rot1,d2pos.x);

    script.light0.getTransform().setLocalRotation(slerp0);
    script.light1.getTransform().setLocalRotation(slerp1);
    script.light2.getTransform().setLocalRotation(slerp2);
});