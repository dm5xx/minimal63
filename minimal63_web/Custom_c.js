var useRemoteURL = false;
var useRemotePort = 59;

var useThisDynDNS = "188.194.220.249";

function getYourRemoteIP()
{
    if(!useRemoteURL)
    {
        console.log("useRemoteURL is not switched on staying local...");
        console.log("initsteps called...");
        initSteps();
        return;
    }

    remote = useThisDynDNS + ":" + useRemotePort;
    console.log("Declared useThisDynDNS is: " + useThisDynDNS);
    console.log("Remote is now " + remote);
    url = remote;
    console.log("initsteps called...");
    initSteps();
}