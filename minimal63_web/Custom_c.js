
// make the minimal63 available from outside (dont forget: inser routing/portforwarding in your internet-router + get a dyndns account!)
var useRemoteURL = false;

// insert you dyndns address here dyndns-ip/dyndns-name ======> public router-ip
var useThisDynDNS = "ph57pz6bsa2qs41o.myfritz.net";

// insert the forwarded port internet ------> public router-ip:59 ----> minimal63-ip:59  
var useRemotePort = 59;

// is this is set to true, the menu is disabled.
var hideMenu =false;

// If set to true, the alter message when a locked slot (lockdef.js) is called is disabled
var hideLockAlert = false;

// set this to true: the profiles 1...9 (profile.js) connot be called by numpad values 1...9
var disableNumbPadShortcuts = false;

// how many boards are connected to the switch...
var numberOfBoards = 1;

// this is the function called by init. If you want to add something, use this function to call some init-stuff you want
function getYourRemoteIP()
{
    if(!useRemoteURL)
    {
        console.log("useRemoteURL is not switched on staying local...");
        console.log("initsteps called...");
        initSteps();
        return;
    }

    var remoteCon = useThisDynDNS + ":" + useRemotePort;
    console.log("Declared useThisDynDNS is: " + useThisDynDNS);
    console.log("Remote is now " + remoteCon);
    url = remoteCon;
    console.log("initsteps called...");
    initSteps();
}

// THis is the function which will be called if defined and if its not a normal get 
function RiseCallback(data)
{
    if(data.Callback == "Reset")
        OpenAdminPage();    
}

// If you are running on a raspberry pi... you can open the admin page.. :P
function OpenAdminPage()
{
    var win = window.open('server.php', '_blank');
    win.focus();
}

