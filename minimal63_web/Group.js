// get the pin result object for a dedicated pin of a bank
function getPinToSwitch(pin, bankNrToSwitch)
{
    console.log("GetPinToSwitch requested");

    var result = {
        Pin : pin,
        PinOn : -1,
        Group: -1
    }

    // if no group for this bank exists => return default
    if(window['groupB'+bankNrToSwitch] == undefined)
        return result;

    var keys = Object.keys(window['groupB'+bankNrToSwitch]);
    var requestedNumberOfGroups = undefined;
    
    // if group is empty => do nothing...
    if(keys != undefined)
        requestedNumberOfGroups = Object.keys(window['groupB'+bankNrToSwitch]).length; window['groupB'+bankNrToSwitch];
    
    console.log("Found number of groups: "+requestedNumberOfGroups);

    // still undefiend? => retunr defaulr
    if(requestedNumberOfGroups == undefined)
        return result;

    // run through the the groups of a bank...
    for(var d = 0; d < requestedNumberOfGroups; d++)
    {
        // check if the requested pin is in a group of this bank...
        var indexFound = window['groupB'+bankNrToSwitch]['group'+d].indexOf(pin);

        // if yes...
        if(indexFound != -1)
        {
            // check if a pin is switched on of this group...
            var leastOneIsOn = isPinOnInTheGroup(window['groupB'+bankNrToSwitch]['group'+d], bankNrToSwitch);
            
            // nothing to change since all pins seems to be off...
            if(leastOneIsOn == -1)
                return result;
            
            // write results object...
            result.Pin = window['groupB'+bankNrToSwitch]['group'+d][indexFound];
            result.PinOn = leastOneIsOn;
            result.Group = window['groupB'+bankNrToSwitch]['group'+d];
        }
    }

    return result;
}

// get the pin which is om in a highländer group, returns -1 if all are off...
function isPinOnInTheGroup(group, bankNr)
{
    for(var f=0; f < group.length; f++)
    {
        window['statusB'+bankNr]

        if(isKInNSet(window['statusB'+bankNr], group[f]))
            return group[f];
    }
    return -1;
}

// set all pins off of a group - the preparedArry is changed for that. easier to run over all of them :p
function setAllGroupdPinsToOff(preparedArray, result, bankNr)
{
    for(var e = 0; e < result.length; e++)
    {
        var elementName = "b"+bankNr+"b"+result[e];
        var element = document.getElementById(elementName); 
        element.className = "xxButton";
        preparedArray[result[e]] = 0;    
    }
}