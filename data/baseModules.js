module.exports = [
  {
    name: "Micro Servo Motor",
    model: "SG90",
    description: "Basic hobby servo for 180-degree control.",
    category: ["motion", "actuator"],
    imageFilename: "sg90.png",
    exampleIdeas: [
      "Use in robotic arms",
      "Control camera angles",
      "Create a simple pan-tilt mechanism",
    ],
    codeSnippets: {
      cpp: "arduino test code",
      python: "python test code",
    },
  },
  {
    name: "DHT11",
    description: "Digital temperature and humidity sensor.",
    category: ["sensor", "temperature", "humidity"],
    imageFilename: "dht11.png",
    exampleIdeas: [
      "Monitor indoor climate",
      "Trigger fans or heaters",
      "Log data for analysis",
    ],
    codeSnippets: {
      cpp: "arduino test code",
      python: "python test code",
    },
  },
];
