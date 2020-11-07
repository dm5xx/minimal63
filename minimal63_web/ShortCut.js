function addKeyEventListener()
{
    document.addEventListener('keydown', keyboardHandler);
}

function removeKeyEventListener()
{
    document.removeEventListener('keydown', keyboardHandler);
}

function keyboardHandler(event)
{
        if (event.defaultPrevented) {
            return;
        }

        var key = event.key || event.keyCode;
        var code = event.code;

        
        if(code == "Numpad"+key)
        {
            if(key>9 || key == 0)
                return;
            loadProfile(key);
            return;
        }
}