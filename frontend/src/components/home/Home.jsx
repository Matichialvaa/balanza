import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { useNavigate } from 'react-router-dom';
import {MongoClient} from "mongodb";
import config from "../../config";


function Home() {
    const [weight, setWeight] = useState(null);
    const [height, setHeight] = useState(null);
    let navigate = useNavigate();
    const uri = 'mongodb://' + config.mongodb.hostname + ':' + config.mongodb.port + '/' + config.mongodb.database;

    useEffect(() => {
        // Conexión al broker MQTT
        const client = mqtt.connect('ws://44.204.54.69:9000');

        // Conexión a MongoD
        const clientMongo = new MongoClient(uri);

        client.on('connect', () => {
            console.log('Conectado al broker MQTT');
            // Suscribirse a los topics 'weight' y 'height'
            client.subscribe(['weight', 'height']);
        });

        client.on('message', (topic, message) => {
            console.log(`Mensaje recibido en topic ${topic}: ${message}`);

            switch (topic) {
                case 'weight':
                    setWeight(message.toString());
                    break;
                case 'height':
                    setHeight(message.toString());
                    break;
                default:
                    break;
            }


            // Guardar datos en MongoDB
            storeData(topic, message).then(r =>
                console.log('Datos guardados en MongoDB')
            ).catch(err =>
                console.error('Error al guardar datos en MongoDB:', err));

            // Si recibo ambos datos, navego a la siguiente página
            if (weight && height) {
                // Chequeo en la base de datos weight && height en la aerolínea y vuelo indicado.
                console.log("Weight: " + weight + " Height: " + height);
                console.log("navigating to next page");
                navigate('/newPage');
            }
        });

        // Función que permite guardar en la db de mongo
        async function storeData(topic, message) {
            try {
                await clientMongo.connect();
                const database = clientMongo.db('nombre_db');
                const collection = database.collection('datos');

                // Inserta los datos en MongoDB
                await collection.insertOne({ topic, message: message.toString(), createdAt: new Date() });
                console.log(`Datos insertados del topic ${topic}`);
            } finally {
                // Asegúrate de cerrar la conexión a MongoDB
                await clientMongo.close();
            }
        }

        // Clean up the effect
        return () => { client.end(); };
    }, [weight, height]); // Corre de nuevo el useEffect si cambia weight o height

    return (
        <div>
            <h1>Home Page</h1>
            {weight && <p>Weight: {weight}</p>}
            {height && <p>Height: {height}</p>}
        </div>
    );
}

export default Home;