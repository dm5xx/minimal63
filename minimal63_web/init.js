function init()
{
    getYourRemoteIP();
}

function initSteps()
{
    createBankButtons(0);
    createBankButtons(1);
    createBankButtons(2);
    createBankButtons(3);

    if(!hideMenu)
        createFooter();
    
    if(!disableNumbPadShortcuts)
        addKeyEventListener();
    
    GetStatus();
    setInterval(GetStatus, 10000);
}