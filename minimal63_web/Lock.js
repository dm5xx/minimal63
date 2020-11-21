// get info if a pin is bank-slot-locked. returns true if the pin is locked and you cannot switch...
function checkIfPinIsLocked(pin, bankNrToSwitch)
{
    // get the lock object of this bank
    var node = window['lock'+bankNrToSwitch]

    // no lock object? nothing to do...
    if(node == undefined)
        return false;

    // get the array of the pin in this bank, on which banks this pin is locked
    var lockedIn = node["p"+pin];

    // pin is not loecked? nothing to do.. :)
    if(lockedIn == undefined)
        return false;

    // lets see if the pins who are locked somewhere are switched on... 
    for(var b = 0; b < lockedIn.length; b++)
    {
        // if its switched on, return true
        //if( window['statusBank'+lockedIn[b]][pin] == 1)
        if(isKInNSet(window['statusB'+lockedIn[b]], pin))
            return true;
    }
    //else return false :)
    return false;
}