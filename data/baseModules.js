module.exports = [
  {
    name: "5mm LED",
    model: "",
    description:
      "A small, two-pin diode that emits light when current flows through it. 5mm refers to the diameter of the LED casing. Available in various colors.",
    category: ["output"],
    imageFilename: "5mm-led.png",
    exampleIdeas: ["Morse code flasher", "Traffic light"],
    codeSnippets: {
      cpp: "#include <Arduino.h>\nint myLedPin = 8;\n\nvoid setup() {\n  pinMode(myLedPin, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(myLedPin, HIGH);\n  delay(1000);\n  digitalWrite(myLedPin, LOW);\n  delay(1000);\n}",
      python:
        "from machine import (Pin)\nfrom time import sleep\n\n#setup\nled = Pin(15, Pin.OUT)\n\n#loop\nwhile True:\n    led.value(1)\n    sleep(1)\n    led.value(0)\n    sleep(1)",
    },
  },
  {
    name: "Micro Servo",
    model: "SG90",
    description:
      "A small servo motor capable of rotating about 180°, with precise control over angle using PWM. Frequently used in robotics.",
    category: ["output", "actuator", "motor"],
    imageFilename: "sg90.png",
    exampleIdeas: ["Robot arm", "Pan/tilt camera mechanism"],
    codeSnippets: {
      cpp: "#include <Arduino.h>\n#include <Servo.h>\n\nint servoPin = 10;\nServo myServo;\n\nvoid setup() {\n  myServo.attach(servoPin);\n}\n\nvoid loop() {\n  myServo.write(180);\n  delay(1000);\n  myServo.write(0);\n  delay(1000);\n}",
      python:
        "from machine import (PWM, Pin)\nimport time\n\n# setup\nservo_pin = PWM(Pin(28))\nservo_pin.freq(50)  # 50Hz is standard for servos\n\ndef set_angle(angle):\n    # Map angle (0-180) to duty cycle for typical servo\n    min_us = 500    # 0.5ms\n    max_us = 2500   # 2.5ms\n    us = min_us + (max_us - min_us) * angle // 180\n    duty = int(us * 65535 // 20000)  # Map microseconds to 16-bit duty cycle\n    servo_pin.duty_u16(duty)\n\n# loop\nwhile True:\n    set_angle(180)\n    time.sleep(1)\n    set_angle(0)\n    time.sleep(1)",
    },
  },
  {
    name: "Temp and humid sensor",
    model: "DHT11",
    description:
      "A basic, low-cost sensor that provides temperature and humidity readings. Communicates digitally over a single data pin.",
    category: ["sensor", "input"],
    imageFilename: "dht11.png",
    exampleIdeas: [
      "Smart fan that turns on at high temperature",
      "Automated greenhouse monitoring",
    ],
    codeSnippets: {
      cpp: '#include <Arduino.h>\n#include <DHT.h>\n#define mySensor DHT11\nint sensPin=2;\nDHT HT(sensPin, mySensor);\nfloat humid;\nfloat tempC;\nfloat tempF; \n\nvoid setup() {\n Serial.begin(9600);\n HT.begin();\n}\n\nvoid loop() {\n humid=HT.readHumidity();\n tempC=HT.readTemperature();\n tempF=HT.readTemperature(true); //true makes it read in Fahrenheit MUST BE LOWERCASE\n Serial.print("Humidity: ");\n Serial.print(humid);\n Serial.print(" | Temp C: ");\n Serial.print(tempC);\n Serial.print("C");\n Serial.print(" | Temp F: ");\n Serial.print(tempF);\n Serial.println("F");\n delay(200);\n}',
      python: "",
    },
  },
  {
    name: "Passive Buzzer",
    model: "",
    description:
      "A sound-producing device that requires a waveform (typically PWM) input to produce sound. Unlike active buzzers, it can play different tones/frequencies.",
    category: ["output", "audio"],
    imageFilename: "passive-buzzer.png",
    exampleIdeas: [
      "Alarm system alert",
      "Audio feedback on button press or error",
    ],
    codeSnippets: {
      cpp: "#include <Arduino.h>\n\nconst int buzPin = 2;\n\nvoid setup() {\n  // No need for pinMode with tone()\n}\n\nvoid loop() {\n  tone(buzPin, 1000);  // Play 1kHz tone\n  delay(1000);         // Wait 1 second\n  noTone(buzPin);      // Stop tone\n  delay(1000);         // Wait 1 second\n}",
      python:
        "from machine import Pin, PWM\nimport time\n\nbuz_pin = Pin(15, Pin.OUT)       # Set pin 15 as output\nbuzzer = PWM(buz_pin)           # Attach PWM to the pin\n\nwhile True:\n    buzzer.freq(1000)           # Set frequency to 1kHz\n    buzzer.duty_u16(32768)      # 50% duty cycle (range: 0 - 65535)\n    time.sleep(1)               # Wait 1 second\n\n    buzzer.duty_u16(0)          # Stop tone by setting duty cycle to 0\n    time.sleep(1)               # Wait 1 second",
    },
  },
  {
    name: "Push button",
    model: "6x6mm Tactile Tact Push Button Micro Switch",
    description:
      "A simple mechanical switch that closes a circuit when pressed. Commonly used for digital input.",
    category: ["input"],
    imageFilename: "pushbutton.png",
    exampleIdeas: ["Start/stop button for a device"],
    codeSnippets: {
      cpp: '#include <Arduino.h>\n\nconst int btnPin = 2;\n\nvoid setup() {\n  Serial.begin(9600);\n\tpinMode(btnPin, INPUT);\n\tdigitalWrite(btnPin, HIGH); //emulate pull up resistor\n}\n\nvoid loop() {\n\tif (digitalRead(btnPin) == LOW) {\n\t\tSerial.println("Button pressed");\n\t}\n}',
      python:
        'from machine import Pin\nimport time\n\nbtn_pin = Pin(15, Pin.IN, Pin.PULL_UP)  # Use internal pull-up resistor\n\nwhile True:\n    if btn_pin.value() == 0:  # Button pressed (active low)\n        print("Button pressed")\n    time.sleep(0.1)  # debounce delay',
    },
  },
  {
    name: "Potentiometer",
    model: "Horizontal Hexagonal Potentiometer 10K",
    description:
      "A variable resistor with a rotating knob that changes resistance from 0 to 10kΩ. Often used for analog control (e.g., volume, brightness).",
    category: ["input", "analog sensor"],
    imageFilename: "potentiometer-10k.png",
    exampleIdeas: [
      "Adjust brightness of an LED",
      "Analog input to control motor speed",
    ],
    codeSnippets: {
      cpp: '#include <Arduino.h>\n\nconst int potPin = A0;\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(potPin, INPUT);\n}\n\nvoid loop() {\n  int potValue = analogRead(potPin);\n  Serial.print("Potentiometer Value: ");\n  Serial.println(potValue);\n  delay(500); // Delay for readability\n}',
      python:
        'from machine import ADC, Pin\nimport time\n\npot = ADC(Pin(26))  # e.g., GPIO26 on a Raspberry Pi Pico for ADC0\n\nwhile True:\n    pot_value = pot.read_u16()  # 16-bit value (0–65535)\n    print("Potentiometer Value:", pot_value)\n    time.sleep(0.5)',
    },
  },
];
