const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();


const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gniuvqv.mongodb.net/?retryWrites=true&w=majority`;
 console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const movieCollections = client.db('movieAppDB').collection('MoviesData')
    

    }
    finally{

    }
}
run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('99 pro server running')
})

app.listen(port, () => console.log(`99 pro server listening on ${port}`))