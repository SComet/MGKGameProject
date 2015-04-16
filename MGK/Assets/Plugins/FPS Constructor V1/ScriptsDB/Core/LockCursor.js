static var canLock : boolean = true;
static var mobile;
static var unPaused : boolean = false;

function Awake () {
	#if UNITY_IPHONE
	mobile = true;
	#elif UNITY_ANDROID
	mobile = true;
	#else
	mobile = false;
	#endif
}
function Start(){
	if(!mobile){
		SetPause(true);
		canLock = true;
		PlayerWeapons.playerActive = false;
	} else {
		SetPause(false);
		canLock=false;
		PlayerWeapons.playerActive = true;
	}

}

function OnApplicationQuit(){
	Time.timeScale = 1;
}

static function SetPause(pause : boolean){
	var player = GameObject.FindWithTag("Player");
	if(mobile){
		return;
	}
	
	InputDB.ResetInputAxes();

	if (pause)
	{
		PlayerWeapons.playerActive = false;
		//Screen.lockCursor = false;
		Time.timeScale = 0;
		Cursor.lockState = CursorLockMode.None;
		Cursor.visible = true;
		PlayerWeapons.playerActive = false;
		player.BroadcastMessage("Freeze", SendMessageOptions.DontRequireReceiver);

	}
	else
	{
		unPaused = true;
		Time.timeScale = 1;
		Cursor.lockState = CursorLockMode.Confined;
		Cursor.visible = false;
		PlayerWeapons.playerActive = true;
		player.BroadcastMessage("UnFreeze", SendMessageOptions.DontRequireReceiver);
	}
}

static function HardUnlock() {
	canLock = false;
	Cursor.lockState = CursorLockMode.None;
	Cursor.visible = true;
}

static function HardLock() {
	canLock = false;
	Cursor.lockState = CursorLockMode.Confined;
	Cursor.visible = false;
}

private var wasLocked = false;

function Update(){
	if(!canLock)
		return;
		
	if (Input.GetMouseButton(0) && Cursor.visible == true){
		SetPause(false);
	}
		
	if (InputDB.GetButton("Escape")){
		SetPause(true);
	}

    // Did we lose cursor locking?
    // eg. because the user pressed escape
    // or because he switched to another application
    // or because some script set Screen.lockCursor = false;
    if(Cursor.visible && wasLocked){
        wasLocked = false;
        SetPause(true);
    }
    // Did we gain cursor locking?
    else if(!Cursor.visible && !wasLocked){
        wasLocked = true;
        SetPause(false);
    }
}

function LateUpdate (){
	unPaused = false;
}