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