function GetStatus()
{
    console.log("GetStatus is requested");

    fetch('http://'+url+'/Get/', { timeout : 2000})
        .then((response) => { return response.json()})
        .then((data) => {            
            if(data.Callback != undefined)
                RiseCallback(data);
            else
                UpdateUI(data);
            console.log(data);
        })
        .catch((err) => {
            console.log("Client Error: "+err);
        });
}

function loadProfile(profileNr)
{
    console.log("LoadProfile "+profileNr);

    var currentProfile = window["Profile"+profileNr];

    subMitValue(0, currentProfile.Bank0);
    setTimeout( () => { subMitValue(1, currentProfile.Bank1) },1000);
    setTimeout( () => { subMitValue(2, currentProfile.Bank2) },1000);
    setTimeout( () => { subMitValue(3, currentProfile.Bank3) },1000);
}
