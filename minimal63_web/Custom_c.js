var useRemoteURL = true;
var useRemotePort = 59;

var useThisDynDNS = undefined;

function getYourRemoteIP()
{
    if(!useRemoteURL)
    {
        console.log("useRemoteURL is not switched on staying local...");
        console.log("initsteps called...");
        initSteps();
        return;
    }

    var receivedRemoteIP = "";
    console.log("Get your remoteIP...");

    fetch('http://h.mmmedia-online.de/publicip/index.php', { timeout : 2000})
        .then((response) => { return response.json()})
        .then((data) => {
            console.log(data);

            if(useThisDynDNS == undefined)
                receivedRemoteIP = data.IP;
            else
                receivedRemoteIP = useThisDynDNS;

            remote = receivedRemoteIP + ":" + useRemotePort;
            console.log("I received this remoteIP from Service: " + data.IP);
            console.log("Declared useThisDynDNS is: " + useThisDynDNS);
            console.log("Remote is now " + remote);
            url = remote;
            console.log("initsteps called...");
            initSteps();
        })
        .catch((err) => {
            console.log("Client Fehler: "+err);
    });
}