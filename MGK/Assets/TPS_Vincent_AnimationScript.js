@script RequireComponent(CharacterController)

public var idleAnimation : AnimationClip;
public var walkAnimation : AnimationClip;
public var runAnimation : AnimationClip;
public var jumpPoseAnimation : AnimationClip;

public var walkSpeed : float = 0.75;
public var runSpeed : float = 1.0;
public var jumpSpeed : float = 1.15;
public var landSpeed : float = 1.0;

public var canJump=true;
private var _animation : Animation;


enum CharacterStates{
	Idle = 0,
	Walking = 1,
	Running = 2,
	Jumping = 3,
}

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
			
}

function Update() {
	
	// ANIMATION sector
	switch(_vincentState){
		case CharacterStates.Idle:
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
	
	//change state
	if(Input.anyKey){
		//running
		if(Input.GetButtonDown("Sprint")&&(Input.GetButtonDown("Vertical")||Input.GetButtonDown("Horizontal"))) {
			_vincentState=CharacterStates.Running;
		}
		//walking
		else if(Input.GetButtonDown("Vertical")||Input.GetButtonDown("Horizontal")) {
			_vincentState=CharacterStates.Walking;
		}
	}
	//No keys pressed => character doing nothing => play idle animation	
	else{
		_vincentState=CharacterStates.Idle;
	}
	

}
