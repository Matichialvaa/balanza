const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require("../../../frontend/src/config");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = 'mongodb://' + config.mongodb.hostname + ':' + config.mongodb.port + '/' + config.mongodb.database;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function startServer() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const db = client.db("mydatabase");
    const collection = db.collection("mycollection");

    app.post('/save-data', async (req, res) => {
      const { topic, message } = req.body;
      const document = { topic, message: message.toString(), createdAt: new Date() };
      try {
        const result = await collection.insertOne(document);
        console.log(`Datos insertados del topic ${topic}`);
        res.status(200).send(`Datos guardados ${result}`);
      } catch (err) {
        console.error('Error al guardar datos en MongoDB:', err);
        res.status(500).send('Error al guardar datos en MongoDB');
      }
    });

    app.get('/data', async (req, res) => {
      try {
        const data = await collection.find({}).toArray();
        res.send(data);
      } catch (err) {
        console.error('Error fetching data from MongoDB', err);
        res.status(500).send('Error fetching data from MongoDB');
      }
    });

    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
}

startServer().then(r => console.log('Server started successfully')).catch(err => console.error('Error starting server:', err));
