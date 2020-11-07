function GetOrderedArraybyValue(value)
{
    var i;
    var feld = [];

    for (i = 0; i < 16; i++)
    {
        feld[i] = value % 2;
        value = float2int(value/2);
    }

    return feld;
}

function GetValueByOrderedArray(arr)
{
  var result = 0;

  for(var a = 15; a >= 0; a--)
  {
        result = result + (arr[a] * 1<<a);
  }

  return result;
}

function float2int(value) {
    return  Math.trunc(value);
}