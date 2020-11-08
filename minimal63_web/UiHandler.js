function UpdateUI(data)
{
    if(statusB0 != data.B0)
    {
        statusB0 = data.B0;
        // fire update bank0;
        updateBank(statusBank0, statusB0, 0);
    }
 
    if(statusB1 != data.B1)
    {
        statusB1 = data.B1;
        // fire update bank1;
        updateBank(statusBank1, statusB1, 1);
    }
 
    if(statusB2 != data.B2)
    {
        statusB2 = data.B2;
        // fire update bank0;
        updateBank(statusBank2, statusB2, 2);
    }
 
    if(statusB3 != data.B3)
    {
        statusB3 = data.B3;
        // fire update bank0;
        updateBank(statusBank3, statusB3, 3);
    }

    if(data.LockingStatus != lockSwitchStatus)
        lockSwitchHandler(data.LockStatus);
    
    console.log("StatusValue_0: " + data.B0);
    console.log("StatusValue_1: " + data.B1);
    console.log("StatusValue_2: " + data.B2);
    console.log("StatusValue_3: " + data.B3);
    console.log("StatusLocking: " + data.LockStatus);
}

function updateBank(statusBank, status, banknr)
{
    var convertedToArray = GetOrderedArraybyValue(status);
    var newClassName;

    console.log("Converted: " + convertedToArray);
    
    for (i = 0; i < 16; i++)
    {
        if(statusBank[i] != convertedToArray[i])
        {
            statusBank[i] = convertedToArray[i];

            if(statusBank[i] == 0)
                newClassName = "xxButton";
            else
                newClassName = "xxButton xxButtonGreen";

            var elementName = "b"+banknr+"b"+i;
            var element = document.getElementById(elementName); 
            element.className = newClassName;
        }
    }

}

function createBankButtons(bankNr)
{
    var createTitleElement = document.createElement("div");
    createTitleElement.setAttribute("class", "title");
    createTitleElement.innerHTML =window["BankLabel"]["Bank"+bankNr];
    document.getElementById("container").appendChild(createTitleElement);      

    for(var i = 0; i < 16; i++)
    {
        var createAElement = document.createElement("a");

        if(!window["disable"]["disable"+bankNr].includes(i))
        {
            createAElement.setAttribute("onclick", "clickRelay("+bankNr+","+i+");");
            createAElement.setAttribute("class", "xxButton");    
            createAElement.innerHTML = window["label"+bankNr]["pin"+i][0] + "<br/>" + window["label"+bankNr]["pin"+i][1];
        }
        else
        {
            createAElement.setAttribute("class", "xxButtonDisabled");    
        }
        createAElement.setAttribute("id", "b"+bankNr+"b"+i);
        document.getElementById("container").appendChild(createAElement);      
    }
}

function createFooter()
{
    var createTitleElement = document.createElement("div");
    createTitleElement.setAttribute("class", "title");
    createTitleElement.innerHTML ="Menu";
    document.getElementById("container").appendChild(createTitleElement);      

    for(var i = 0; i < 4; i++)
    {
        var createFooterElement = document.createElement("a");
        createFooterElement.setAttribute("onclick", "subMitValue("+i+", 0)");
        createFooterElement.setAttribute("class", "xxButton xxFooter");    
        createFooterElement.innerHTML = window["BankLabel"]["Bank"+i]+"<br/>Reset";
        createFooterElement.setAttribute("id", "r"+i+"r0");
        document.getElementById("container").appendChild(createFooterElement);      
    }    

    var createLockElement = document.createElement("a");
    createLockElement.setAttribute("onclick", "updateLockStatus()");
    createLockElement.setAttribute("class", "xxButton xxLockSwitch xxButtonGreen");    
    createLockElement.innerHTML = "SWITCH<br/>LOCK";
    createLockElement.setAttribute("id", "lock");
    document.getElementById("container").appendChild(createLockElement);      

    var createResetAllElement = document.createElement("a");
    createResetAllElement.setAttribute("onclick", "subMitReset()");
    createResetAllElement.setAttribute("class", "xxButton xxFooterReset");    
    createResetAllElement.innerHTML = "SWITCH<br/>RESET";
    createResetAllElement.setAttribute("id", "rAll");
    document.getElementById("container").appendChild(createResetAllElement);      

}

