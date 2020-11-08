function init()
{
    createBankButtons(0);
    createBankButtons(1);
    createBankButtons(2);
    createBankButtons(3);
    createFooter();
    addKeyEventListener();
    loadInitProfile();
    setInterval(GetStatus, 10000);
}