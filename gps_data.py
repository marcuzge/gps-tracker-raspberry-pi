from gps import *
import serial
import pynmea2
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pubnub.exceptions import PubNubException

channel = "pi-gps-tracker"

pnconfig = PNConfiguration()
pnconfig.publish_key = "KEY"
pnconfig.subscribe_key = "KEY"
pnconfig.uuid = 'trackerServer'
pnconfig.ssl = False

pubnub = PubNub(pnconfig)
pubnub.subscribe().channels(channel).execute()

while True:
    port="/dev/ttyACM0"
    ser=serial.Serial(port, baudrate=9600, timeout=0.5)
    newdata= str(ser.readline())
    print(newdata)

    if newdata[0:8] == "b'$GPRMC":
        stripped = newdata.lstrip("b'")[:-5]
        print(stripped)
        newmsg=pynmea2.parse(stripped)
        lat=newmsg.latitude
        lng=newmsg.longitude
        print ("Your position: lon = " + str(lat) + ", lat = " + str(lng))
        try:
            pubnub.publish().channel(channel).message({
                'lat':lat,
                'lng':lng
            }).sync()
        except PubNubException as e:
            print("PubNubException: " + e)