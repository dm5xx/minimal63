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

    subMitValue(bankNr, submitValue)
}

function subMitValue(bankNr, submitValue)
{
    fetch('http://'+url+'/Set'+bankNr+'/'+submitValue, { timeout : 2000})
    .then((response) => { return response})
    .then((data) => {
        console.log("Fired " + bankNr + " with Value " + submitValue);
        setTimeout(GetStatus,100);
    })
    .catch((err) => {
        console.log("Client Fehler: "+err);
    });
}

function subMitReset()
{
    fetch('http://'+url+'/Reset/', { timeout : 2000})
    .then((response) => { return response})
    .then((data) => {
        console.log("Reset");
        setTimeout(GetStatus,2000);
    })
    .catch((err) => {
        console.log("Client Fehler: "+err);
    });
}