const mqtt = require("mqtt");
var config = require("./config");

var mqttUri  = 'ws://' + config.mqtt.hostname + ':' + config.mqtt.port;
const client = mqtt.connect(mqttUri);

client.on("connect", () => {
    client.subscribe("+", (err) => {
        if (!err) {
            console.log("Client connected");
        }
    });
});

client.on("message", (topic, message) => {
    // message is Buffer
    console.log(topic.toString() + " : " +message.toString());
});