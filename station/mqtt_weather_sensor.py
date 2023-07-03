import paho.mqtt.client as mqtt
from random import randrange, uniform
import time

mqttBroker = "broker.hivemq.com"
client = mqtt.Client("Test")
client.connect(mqttBroker)

while True:
    randNum = uniform(10.0, 20.0)
    client.publish("TEMP_DATA", randNum,qos=2)
    print("[+] Published: " + str(randNum))
    time.sleep(3)