@script RequireComponent(CharacterController)

public var idleAnimation : AnimationClip;
public var walkAnimation : AnimationClip;
public var runAnimation : AnimationClip;
public var aimAnimation : AnimationClip;
public var jumpPoseAnimation : AnimationClip;

public var walkSpeed : float = 0.75;
public var runSpeed : float = 1.0;
public var jumpSpeed : float = 1.15;
public var breathingSpeed : float = .75;


public var canJump=true;
private var _animation : Animation;


enum CharacterStates{
	Idle = 0,
	Walking = 1,
	Running = 2,
	Jumping = 3,
}

private var isVincentAiming=false;
private var _vincentState : CharacterStates;

function Awake ()
{
	moveDirection = transform.TransformDirection(Vector3.forward);
	
	_animation = GetComponent(Animation);
	if(!_animation)
		Debug.Log("The character you would like to control doesn't have animations. Moving her might look weird.");
	
	/*
public var idleAnimation : AnimationClip;
public var walkAnimation : AnimationClip;
public var runAnimation : AnimationClip;
public var jumpPoseAnimation : AnimationClip;	
	*/
	if(!idleAnimation) {
		_animation = null;
		Debug.Log("No idle animation found. Turning off animations.");
	}
	if(!walkAnimation) {
		_animation = null;
		Debug.Log("No walk animation found. Turning off animations.");
	}
	if(!runAnimation) {
		_animation = null;
		Debug.Log("No run animation found. Turning off animations.");
	}
	if(!jumpPoseAnimation && canJump) {
		_animation = null;
		Debug.Log("No jump animation found and the character has canJump enabled. Turning off animations.");
	}
	if(!aimAnimation) {
		_animation = null;
		Debug.Log("No aim animation found. Turning off animations.");
	}
	
	// Puts the aiming animation on a different level and set it up for mixing with other animations
	var mixTransform : Transform = transform.Find("Hips/Spine");
	_animation[aimAnimation.name].AddMixingTransform(mixTransform);	
	_animation[aimAnimation.name].layer = 10;
	_animation[aimAnimation.name].blendMode=AnimationBlendMode.Blend;
	_animation[aimAnimation.name].enabled=true;
	_animation[aimAnimation.name].weight= 1;
	
}

function Update() {
	
	// ANIMATION sector
	switch(_vincentState){
		case CharacterStates.Idle:
			_animation[idleAnimation.name].speed=breathingSpeed;
			_animation.CrossFade(idleAnimation.name); 
			break;
		case CharacterStates.Walking: 
			_animation[walkAnimation.name].speed=walkSpeed;
			_animation.CrossFade(walkAnimation.name); 
			break;
		case CharacterStates.Running:
			_animation[runAnimation.name].speed=runSpeed;	
			_animation.CrossFade(runAnimation.name); 
			break;
	}
	
	if(isVincentAiming){
		_animation[aimAnimation.name].speed=breathingSpeed;
		_animation.CrossFade(aimAnimation.name);
	}
	else{
		_animation.Stop(aimAnimation.name);
	}

	//change Vincent's state sector
	//running
	if(Input.GetButton("Sprint")&&(Input.GetButton("Vertical")||Input.GetButton("Horizontal"))) {
		_vincentState=CharacterStates.Running;
	}
	//walking
	else if(!Input.GetButton("Sprint")&&(Input.GetButton("Vertical")||Input.GetButton("Horizontal"))) {
		_vincentState=CharacterStates.Walking;
	}
	//No keys pressed => character doing nothing => play idle animation	
	else{
		_vincentState=CharacterStates.Idle;
	}
	
	//change aiming state. Disregards other animations.
	if(Input.GetButtonDown("Aim"))
		isVincentAiming=true;
	if(Input.GetButtonUp("Aim"))
		isVincentAiming=false;
}
