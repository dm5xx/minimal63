function clickRelay(bankNr, relanNr)
{
    console.log("Set CLickrelay is fired");

    if(lockSwitchStatus)
    {
        alert("The Switch is completly LOCKED");
        return;
    }

    var isLocked = checkIfPinIsLocked(relanNr, bankNr);
    var result =  getPinToSwitch(relanNr, bankNr);

    if(isLocked)
    {
        if(!hideLockAlert)
            alert("This SLOT is LOCKED!");
        
        console.log("Slot is locked!");
        return;
    }

    var preparedArray = GetOrderedArraybyValue(window['statusB'+bankNr]);
    
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

    subMitValue(bankNr, submitValue);
}

function subMitValue(bankNr, Value)
{
    var x = [];
    x["B"+bankNr] = Value; 
    UpdateUI(x);
        
    fetch('http://'+url+'/Set'+bankNr+'/'+Value, { timeout : 2000})
    .then((response) => { return response})
    .then((data) => {
        console.log("Fired " + bankNr + " with Value " + Value);
        //setTimeout(GetStatus, 100);
    })
    .catch((err) => {
        console.log("Client Fehler: "+err);
    });
}

function subMitReset()
{
    fetch('http://'+url+'/Reset', { timeout : 2000})
    .then((response) => { return response.json()})
        .then((data) => {
        console.log("Reset called!");

        if(data.Callback != undefined)
            RiseCallback(data);
    })
    .catch((err) => {
        console.log("Client Fehler: "+err);
    });
}

function updateLockStatus()
{
    console.log("Update LockStatus called");

    if(!lockSwitchStatus)
        lockSwitch();
    else
        unlockSwitch();
}

function lockSwitch()
{
    fetch('http://'+url+'/Lock', { timeout : 2000})
    .then((response) => { return response})
    .then((data) => {

        lockSwitchHandler(true);
        console.log("Lock called!");
    })
    .catch((err) => {
        console.log("Client Fehler: "+err);
    });
}

function unlockSwitch()
{
    fetch('http://'+url+'/UnLock', { timeout : 2000})
    .then((response) => { return response})
    .then((data) => {

        lockSwitchHandler(false);
        console.log("Unlock called!");
    })
    .catch((err) => {
        console.log("Client Fehler: "+err);
    });
}

function lockSwitchHandler(lockStatus)
{
    lockSwitchStatus = lockStatus;

    var elementName = "lock";
    var element = document.getElementById(elementName); 

    if(lockSwitchStatus)
    {
        element.className = "xxButton xxLockSwitch xxButtonRed";
        element.innerHTML = "SWITCH is LOCKED <br/>UNLOCK";
    }
    else
    {
        element.className = "xxButton xxLockSwitch xxButtonGreen";
        element.innerHTML = "SWITCH not LOCKED<br/>LOCK";
    }
}