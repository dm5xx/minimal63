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
    createFooter();
    addKeyEventListener();
    GetStatus();
    setInterval(GetStatus, 10000);
}