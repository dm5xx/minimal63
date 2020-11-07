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
 
    console.log("Recieved: " + data.B0);
    console.log("Recieved: " + data.B1);
    console.log("Recieved: " + data.B2);
    console.log("Recieved: " + data.B3);
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
    createTitleElement.innerHTML ="Bank "+bankNr;
    document.getElementById("container").appendChild(createTitleElement);      

    for(var i = 0; i < 16; i++)
    {
        var createAElement = document.createElement("a");
        createAElement.setAttribute("onclick", "clickRelay("+bankNr+","+i+");");
        createAElement.setAttribute("id", "b"+bankNr+"b"+i);
        createAElement.setAttribute("class", "xxButton");
        createAElement.innerHTML = window["label"+bankNr]["pin"+i][0] + "<br/>" + window["label"+bankNr]["pin"+i][1];
        document.getElementById("container").appendChild(createAElement);      
    }
}

