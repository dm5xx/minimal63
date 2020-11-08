function GetStatus()
{
    console.log("GetStatsuFired");

    fetch('http://'+url+'/Get/', { timeout : 2000})
        .then((response) => { return response.json()})
        .then((data) => {
            UpdateUI(data);
            console.log(data);
        })
        .catch((err) => {
            console.log("Client Fehler: "+err);
        });
}

function loadProfile(profileNr)
{
    console.log("LoadProfile "+profileNr);

    var currentProfile = window["Profile"+profileNr];

    subMitValue(0, currentProfile.Bank0);
    setTimeout( () => { subMitValue(1, currentProfile.Bank1) },2000);
    setTimeout( () => { subMitValue(2, currentProfile.Bank2) },2000);
    setTimeout( () => { subMitValue(3, currentProfile.Bank3) },2000);
}