#include <SoftReset.h>
#include <Ethernet.h>

//#define DEBUG

// here you can define, which pin-number belongs to which bank...
byte pinsBank0[] = { 54, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18};
byte pinsBank1[] = { 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34}; 
byte pinsBank2[] = { 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 53}; 
byte pinsBank3[] = { 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 1};

// Arrays to know whos on or off...
byte statusBank0[16] = { 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 };
byte statusBank1[16] = { 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 };
byte statusBank2[16] = { 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 };
byte statusBank3[16] = { 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 };

// Here ths current status is stored - faster check for equality...
unsigned int bankStatus0 = 0;
unsigned int bankStatus1 = 0;
unsigned int bankStatus2 = 0;
unsigned int bankStatus3 = 0;

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};

//uncomment and change if you need to adress a static ip in your local environment
//IPAddress ip(192, 168, 97, 177);
int myPort = 59;
EthernetServer server(myPort); // (port 80 is default for HTTP)

char requestString[100];
bool isLocked = false;

// all files are in their newest version on DM5XX webserver. You have to point this address to your websrver oder local computer, if you want to change something else than labels..
String URLToJS = "h.mmmedia-online.de/minimal63/";

// adjust this URL if you want to change Label.js, GroupDef.js, Lock.js, Disable.js (to customize them). So ALL 4 files must be stored on your own webserver/local computer than, even if you just want to leave one or more default!
String URLToCustomize = "h.mmmedia-online.de/minimal63XX/";

// this is the url, where the dashboard will call to reach the switch. can be an internal IP (same as IPADDRESS above!!!) or a dyndns-url, forwarded to IPADDRESS (above).
String SwitchURL = "255.255.255.255";
String MyLocalIP = "192.168.97.177"; 
String ClientIP = "255.255.255.255"; 

////////////////////////////////////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
void GetOrderedArraybyValue(int value, byte * feld)
{
    int i;

    for (i = 0; i < 16; i++)
    {
        feld[i] = value % 2;
        value /= 2;
    }
}

int GetValueByOrderedArray(byte * arr)
{
  int result = 0;
      
  for(int a = 15; a >= 0; a--)
  {
        result = result + (arr[a] * 1<<a);
  }

  return result;
}

void updatePin(int pin, byte value, int bankNr)
{
  switch(bankNr)
  {
    case 0:
      statusBank0[pin] = value;
      bankStatus0 = GetValueByOrderedArray(&statusBank0[0]);
      updateSingleRelay(pin, value, &pinsBank0[0]);
      
      for(int a=0; a < 16; a++)
      {
        Serial.print(statusBank0[a]);
        Serial.print(',');
      }
      break;
    case 1:
      statusBank1[pin] = value;
      bankStatus1 = GetValueByOrderedArray(&statusBank1[0]);
      updateSingleRelay(pin, value, &pinsBank0[0]);
      break;
    case 2:
      statusBank2[pin] = value;
      bankStatus2 = GetValueByOrderedArray(&statusBank2[0]);
      updateSingleRelay(pin, value, &pinsBank2[0]);
      break;
    case 3:
      statusBank3[pin] = value;
      bankStatus3 = GetValueByOrderedArray(&statusBank3[0]);
      updateSingleRelay(pin, value, &pinsBank3[0]);
      break;
    default:
      break;
  }
}

void updatePinStatus(int value, int bankNr)
{
  switch(bankNr)
  {
    case 0:
      bankStatus0 = value;
      GetOrderedArraybyValue(value, &statusBank0[0]);
      updateRelays(&statusBank0[0],&pinsBank0[0]);

#ifdef DEBUG
      Serial.println(bankStatus0);
      for(int a=0; a < 16; a++)
      {
        Serial.print(statusBank0[a]);
        Serial.print(',');
      }
#endif
      break;
    case 1:
      bankStatus1 = value;
      GetOrderedArraybyValue(value, &statusBank1[0]);
      updateRelays(&statusBank1[0],&pinsBank1[0]);
      break;
    case 2:
      bankStatus2 = value;
      GetOrderedArraybyValue(value, &statusBank2[0]);
      updateRelays(&statusBank2[0],&pinsBank2[0]);
      break;
    case 3:
      bankStatus3 = value;
      GetOrderedArraybyValue(value, &statusBank3[0]);
      updateRelays(&statusBank3[0],&pinsBank3[0]);
      break;
    default:
      break;
  }
}

void updateRelays(const byte *bank, byte *pins)
{
  for (int i = 0; i < 16; i++)
  {
    if(bank[i] == 0)
       digitalWrite(pins[i], LOW);
    else
       digitalWrite(pins[i], HIGH);    
  } 
}

void updateSingleRelay(int pin, byte value, byte *pins)
{
   if(value == 0)
    digitalWrite(pins[pin], LOW);
   else
    digitalWrite(pins[pin], HIGH);    
}

/*********************************************************************************************************************************/
/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++ THE WEB PAGES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
/*********************************************************************************************************************************/

void sendEmptyPage(EthernetClient &client)
{
  Send200OK(client);
}

void SendFavicon(EthernetClient &client)
{
   Send200OK(client);
   client.println(F(""));
   client.println(F("<!DOCTYPE html>"));
   client.println(F("<HTML>"));
   client.println(F("<link rel=\"icon\" href=\"data:;base64,=\">"));
   client.println(F("</HTML>"));
}

void GetDataJSON(EthernetClient &client)
{
  client.println(F("HTTP/1.0 200 OK"));
  client.println(F("Access-Control-Allow-Origin: *"));
  client.println(F("Content-Type: application/json"));
  client.println(F("Connection: close"));
  client.println(F(""));
  client.print(F("{\"B0\": "));
  client.print(bankStatus0);
  client.print(F(", \"B1\": "));
  client.print(bankStatus1);
  client.print(F(", \"B2\": "));
  client.print(bankStatus2);
  client.print(F(", \"B3\": "));
  client.print(bankStatus3);
  client.print(F(", \"LockStatus\": "));
  client.print(isLocked);
  client.print(F(", \"Clients\": \""));
  client.print(ClientIP);
  client.print(F("\"}"));
}

void SendLocked(EthernetClient &client)
{
  client.println(F("HTTP/1.0 200 OK"));
  client.println(F("Access-Control-Allow-Origin: *"));
  client.println(F("Content-Type: application/json"));
  client.println(F("Connection: close"));
  client.println(F(""));
  client.print(F("{\"Lockingstatus\": "));
  client.print(isLocked);
  client.print(F("}"));
}
void Send200OK(EthernetClient &client)
{
  client.println(F("HTTP/1.1 200 OK")); //send new page
  client.println(F("Access-Control-Allow-Origin: *"));
  client.println(F(""));
  client.println(F("Content-Type: text/html"));
}

void MainPage(EthernetClient &client)
{
   client.println("HTTP/1.1 200 OK");
   client.println(F("Access-Control-Allow-Origin: *"));
   client.println(F("Content-Type: text/html"));
   client.println("Connection: close");  // the connection will be closed after completion of the response   client.println(F(""));
   client.println(F(""));
   client.println(F("<!DOCTYPE html>"));
   client.println(F("<HTML>"));
   client.println(F("<HEAD>"));
   client.println(F("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>"));
   client.println(("<link rel=\"stylesheet\" type=\"text/css\" href=\"http://"+ URLToJS +"style.css\" media=\"screen\"/>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToJS +"init.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToJS +"ShortCut.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToCustomize +"Custom_c.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToCustomize +"Profile_c.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToCustomize +"Disable_c.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToCustomize +"Label_c.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToCustomize +"BankDef_c.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToJS +"Globals.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToCustomize +"LockDef_c.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToJS +"Lock.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToCustomize +"GroupDef_c.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToJS +"Group.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToJS +"UiHandler.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToJS +"GetData.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToJS +"SetData.js\"></script>"));
   client.println(("<script language=\"javascript\" type=\"text/javascript\" src=\"http://"+ URLToJS +"Helper.js\"></script>"));
   client.print(F(""));
   client.println(F("<!-- Change SwitchURL to the url, where your webswitch is reachable from outside/inside. Dont forget the portforwarding...-->"));
   client.print(F("<script>var url='"));
   client.print((MyLocalIP));
   client.print(":");
   client.print(myPort);
   client.print(F("';\r"));
   client.println(F("</script>"));
   client.print(F("<TITLE>"));
   client.print("minimal63 - Remote Switch by DM5XX");
   client.println(F("</TITLE>"));
   client.println(F("</HEAD>"));
   client.println(F("<BODY>"));
   client.println(F("<div class=\"grid-container\" id=\"container\"></div>"));
   client.println(F("</BODY>"));
   client.println(F("<script>(() => { init(); })()</script>"));
   client.println(F("</HTML>"));
}

void setup() {

  // disable SD SPI
  pinMode(4,OUTPUT);
  digitalWrite(4,HIGH);
  
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  Serial.println("Ethernet WebServer DHCP");

  // start the Ethernet connection and the server:
  //Ethernet.begin(mac, ip);
  Ethernet.begin(mac);

  // start the server
  server.begin();
  Serial.print("server is at ");

  IPAddress address = Ethernet.localIP();
  MyLocalIP = String() + address[0] + "." + address[1] + "." + address[2] + "." + address[3];
  
  Serial.println(MyLocalIP);

  // set mode for all needed pins in each bank
  for (int out = 0; out < 16; out++)
  {
    pinMode(pinsBank0[out], OUTPUT);
    pinMode(pinsBank1[out], OUTPUT);
    pinMode(pinsBank2[out], OUTPUT);
    pinMode(pinsBank3[out], OUTPUT);
    digitalWrite(pinsBank0[out], LOW);
    digitalWrite(pinsBank1[out], LOW);
    digitalWrite(pinsBank2[out], LOW);
    digitalWrite(pinsBank3[out], LOW);
  }
}

#define BUFSIZE 20

void loop() 
{
  // Create a client connection
  EthernetClient client = server.available();
  char clientline[BUFSIZE];
  int index = 0;
  
  if (client) 
  {
    IPAddress localClientIP = client.remoteIP();
    ClientIP = String() + localClientIP[0] + "." + localClientIP[1] + "." + localClientIP[2] + "." + localClientIP[3];
  
    byte charIndex = 0;

    // connectLoop controls the hardware fail timeout
    int connectLoop = 0;
    
    while (client.connected()) 
    { 
      connectLoop++;

      if(connectLoop > 10000)
      {
        client.stop();
        break;
      }
      
      if (client.available()) 
      {
        char c = client.read();
      
        if (c != '\n' && c != '\r') {
          clientline[index] = c;
          index++;

          if (index >= BUFSIZE) 
            index = BUFSIZE -1;
          
          continue;
        }
        
        // got a \n or \r new line, which means the string is done
        clientline[index] = 0;
        
        // Print it out for debugging
#ifdef DEBUG
        Serial.println(clientline);
#endif
        
        //if HTTP request has ended
        if (strstr(clientline, "GET /Get/") != 0) 
        {    
#ifdef DEBUG
            Serial.println("Get detected");
#endif
            GetDataJSON(client);
            connectLoop = 0;
            break;
        }

        byte end = 0;            
        for(int r = 11; r < 16; r++)
        {
          if(clientline[r] == ' ')
            end = r;
          else
            continue;
        }

        String sss = clientline;
        String subSss = sss.substring(10, end);
        
        if(strstr(clientline, "GET /Set") != 0)
        {
          if(isLocked)
          {
            SendLocked(client);
            connectLoop = 0;
            break;
          }
          
          int value = subSss.toInt(); 
  
#ifdef DEBUG
          Serial.println(clientline[8]);
          Serial.println(value);
#endif

          switch (clientline[8])
          {
            case '0':
#ifdef DEBUG
              Serial.println("SetBank0 detected");
#endif
              updatePinStatus(value, 0);            
              break;
            case '1':
#ifdef DEBUG
              Serial.println("SetBank1 detected");
#endif
              updatePinStatus(value, 1);            
              break;
            case '2':
#ifdef DEBUG
              Serial.println("SetBank2 detected");
#endif
              updatePinStatus(value, 2);            
              break;
            case '3':
#ifdef DEBUG
              Serial.println("SetBank3 detected");
#endif
              updatePinStatus(value, 3);            
              break;
          }
          Send200OK(client);
          connectLoop = 0;
          break;
        }
        else if(strstr(clientline, "GET /set") != 0)
        {
          int delim = subSss.indexOf('/');
          int pinNr = subSss.substring(0, delim).toInt();
          int cmd = (subSss[subSss.length()-1])-48;

#ifdef DEBUG
          Serial.println(pinNr);
          Serial.println(cmd);
#endif

          switch (clientline[8])
          {
            case '0':
#ifdef DEBUG
              Serial.println("Manual Set at bank 0");          
#endif
              updatePin(pinNr, cmd, 0);
              break;
            case '1':
#ifdef DEBUG
              Serial.println("Manual Set at bank 1");          
#endif
              updatePin(pinNr, cmd, 1);
              break;
            case '2':
#ifdef DEBUG
              Serial.println("Manual Set at bank 2");          
#endif
               updatePin(pinNr, cmd, 2);
               break;
            case '3':
#ifdef DEBUG
                Serial.println("Manual Set at bank 3");          
#endif
               updatePin(pinNr, cmd, 3);
               break;
          }
          Send200OK(client);
          connectLoop = 0;
          break;
        }
        else if (strstr(clientline, "GET /favicon") != 0)
        {
#ifdef DEBUG
          Serial.println("Favicon requested");
#endif
          SendFavicon(client);
          connectLoop = 0;
          break;
        }
        else if (strstr(clientline, "GET /Reset") != 0)
        {
          client.println(F(""));
          client.println(F("<!DOCTYPE html>"));
          client.println(F("<HTML><BODY>R-E-S-E-T!!!</BODY></HTML>"));
          delay(50); // 1?  
          client.stop();
          soft_restart();
        }
        else if (strstr(clientline, "GET /Lock") != 0)
        {
          isLocked = true;
          SendLocked(client);
          connectLoop = 0;
          break;
        }
        else if (strstr(clientline, "GET /UnLock") != 0)
        {
          isLocked = false;
          SendLocked(client);
          connectLoop = 0;
          break;
        }
                  
#ifdef DEBUG
        Serial.println("Call main");
#endif
        MainPage(client);
        connectLoop = 0;
        break;
      }
    }
    delay(10); // 1?
  
    client.stop();
#ifdef DEBUG
    Serial.println("disconnected.");
#endif
  }
}
