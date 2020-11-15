function init()
{
    getYourRemoteIP();
}

function initSteps()
{
    initCreateBankButtons();
    
    if(!hideMenu)
        createFooter();
    
    if(!disableNumbPadShortcuts)
        addKeyEventListener();
    
    GetStatus();
    setInterval(GetStatus, 10000);
}