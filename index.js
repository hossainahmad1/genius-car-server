

const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2wczu4w.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const geniusCollection = client.db('geniusDb').collection('service');
        const ordersCollection = client.db('geniusDb').collection('orders');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = geniusCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await geniusCollection.findOne(query)
            res.send(result)
        })

        // orders api

        app.get('/orders', async (req, res) => {
            // console.log(req.query.email)
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = ordersCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.send(result);
        })
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.send(result);
        })

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await ordersCollection.updateOne(query, updatedDoc)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(err => console.log(err))


app.use('/', (req, res) => {
    res.send('genius car is running')
})

app.listen(port, () => {
    console.log(`Genius car server running on port ${port}`)
})
