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

function loadInitProfile()
{
    loadProfile(1);
}

function loadProfile(profileNr)
{
    var currentProfile = window["Profile"+profileNr];

    subMitValue(0, currentProfile.Bank0);
    subMitValue(1, currentProfile.Bank1);
    subMitValue(2, currentProfile.Bank2);
    subMitValue(3, currentProfile.Bank3);
}