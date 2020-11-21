function UpdateUI(data)
{   
    for(var a= 0; a < numberOfBoards; a++)
    {
        if(window["statusB"+a] != data["B"+a])
        {
            window["statusB"+a] = data["B"+a];
            //updateBank(window["statusBank"+a], window["statusB"+a], a);
            updateBank(window["statusB"+a], a);
            console.log("Value of Bank"+a+": " + data["B"+a]);
        }        
    }
    lockSwitchHandler(data.LockStatus);    
    console.log("StatusLocking: " + data.LockStatus);
}

// function updateBank(statusBank, status, banknr)
// {
//     var convertedToArray = GetOrderedArraybyValue(status);
//     var newClassName;

//     console.log("Converted: " + convertedToArray);
    
//     for (i = 0; i < 16; i++)
//     {
//         if(statusBank[i] != convertedToArray[i])
//         {
//             statusBank[i] = convertedToArray[i];

//             if(statusBank[i] == 0)
//                 newClassName = "xxButton";
//             else
//                 newClassName = "xxButton xxButtonGreen";

//             var elementName = "b"+banknr+"b"+i;
//             var element = document.getElementById(elementName); 
//             element.className = newClassName;
//         }
//     }

// }

function updateBank(status, banknr)
{
    var convertedToArray = GetOrderedArraybyValue(status);
    var newClassName;

    console.log("Converted: " + convertedToArray);
    
    for (i = 0; i < 16; i++)
    {
        if(convertedToArray[i] == 0)
            newClassName = "xxButton";
        else
            newClassName = "xxButton xxButtonGreen";

        var elementName = "b"+banknr+"b"+i;
        var element = document.getElementById(elementName); 
        element.className = newClassName;
    }
}

function initCreateBankButtons()
{
    if(typeof numberOfBoards === "undefined")
        numberOfBoards = 4;
        
    for(var i = 0; i < numberOfBoards; i++)
    {
        if(window["BankLabel"]["Bank"+i] == undefined)
            continue;
        createBankButtons(i);
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

    for(var i = 0; i < numberOfBoards; i++)
    {
        if(window["BankLabel"]["Bank"+i] == undefined)
            continue;
        
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