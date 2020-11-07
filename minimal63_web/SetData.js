function clickRelay(bankNr, relanNr)
{
    console.log("Set Fired");


    var isLocked = checkIfPinIsLocked(relanNr, bankNr);

    var result =  getPinToSwitch(relanNr, bankNr);

    console.log("I found muu " + result.Pin);

    if(isLocked)
    {
        alert("LOCKED!");
        return;
    }

    var preparedArray = [] 
    
    for(var m = 0; m < 16; m++)
    {
        preparedArray[m] = window['statusBank'+bankNr][m];
    }

    if(result.PinOn != relanNr)
    {
        setAllGroupdPinsToOff(preparedArray, result.Group, bankNr);
        relanNr = result.Pin;
    }

    if(preparedArray[relanNr] == 0)
    {
        preparedArray[relanNr] = 1;
        newClassName = "xxButton xxButtonGreen";            
    }
    else
    {
        preparedArray[relanNr] = 0;
        newClassName = "xxButton";
    }

    var elementName = "b"+bankNr+"b"+relanNr;
    var element = document.getElementById(elementName); 
    element.className = newClassName;

    var submitValue = GetValueByOrderedArray(preparedArray);

    fetch('http://'+url+'/Set'+bankNr+'/'+submitValue, { timeout : 2000})
        .then((response) => { return response})
        .then((data) => {
            console.log("FiredFiredFired");
            setTimeout(GetStatus,500);
        })
        .catch((err) => {
            console.log("Client Fehler: "+err);
        });
}