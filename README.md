# minimal63 - Switching 63 Ports on a Arduino Mega via the web :)

You need:
- Arduino Mega
- Arduino Ethernet-Shield W5100 (oder W5500)
- PCB from remoteQTH.com is not necessary, but makes things a lot more easy... https://remoteqth.com/arduino-web-switch.php

Install newest Arduino IDE.
Create dummy project. search for it in your windows explorer. Mine was in E:\OneDrive\Documents\Arduino

Paste the content of "libraries" into "libraries" (or create folder if he doesnt exist)
Get files dm5xx/minimal_custom and if needed dm5xx/minimal_control.

Paste minimal63 into this folder and dm5xx/minimal_custom and if needed dm5xx/minimal_control into the folder minimal63/public.

Label.js => Adjust the Labels for the Webpage<br/>
Lock.js => Define which slots should be locked<br/>
Group.js => Create groups. Highlander principle "There can be only one (on)"<br/>
Profile.js => Define what Profile (All 4 bank, no locking/grouping! Define with caution!) should be loaded by Num-Pad 1....9 Note: Loading is delayed due to Roundtrip reasons (its just an Arduino...)<br/>
Disable.js => Define which Button (Nr. 0...15) should NOT BE visible on each different Bank<br/>
BankDef.js => Define the displayed Labels for Bank0...4<br/>

Questions? dm5xx@gmx.de
