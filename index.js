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


// Jwt Token
 function verifyJWT(req, res, next) {
  console.log("token inside verifyJWT", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }
  // bearer  eta split(" ") kora hoilo
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}  

async function run(){
    try{
        const beautyProductCollections = client.db('99proBusinessSite').collection('beautyProducts')
        const gadgetsAndToolsCollections = client.db('99proBusinessSite').collection('gadgetAndTools')
        const babyProductsCollections = client.db('99proBusinessSite').collection('babyProducts')
        const AllProductsCollections = client.db('99proBusinessSite').collection('allProducts')
        const usersCollections = client.db('99proBusinessSite').collection('users')
       
        // NOTE: make sure you use verifyAdmin after verifyJWT
        const verifyAdmin = async (req, res, next) => {
        // const decodedEmail = req.decoded.email;
        const query = { email: decodedEmail };
        const user = await usersCollection.findOne(query);
        if (user?.role !== "admin") {
            return res.status(403).send({ message: "forbidden access" });
        }
        next();
        };
       
        app.get('/beautyProducts', async (req, res) => {
             const query = {};
             const beautyProduct = await beautyProductCollections.find(query).toArray();
             res.send(beautyProduct);
         })

        app.get('/gadgetsAndTools', async (req, res) => {
             const query = {};
             const gadgetsAndTools = await gadgetsAndToolsCollections.find(query).toArray();
             res.send(gadgetsAndTools);
         })

         app.get('/babyProducts', async (req, res) => {
             const query = {};
             const babyProducts = await babyProductsCollections.find(query).toArray();
             res.send(babyProducts);
         })
         app.get('/allProducts', async (req, res) => {
             const query = {};
             const allProducts = await AllProductsCollections.find(query).toArray();
             res.send(allProducts);
         })


         //------------ 1st check jwt token was correctly work or not-----------
            app.get("/jwt", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            console.log(user)
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
                expiresIn: "50d",
                });
                return res.send({ token: token });
            }
            res.status(403).send({ token: "" });
            });  

                   // post all users and add database
        app.post('/users', async(req , res) => {
            const user = req.body;
            const result = await usersCollections.insertOne(user);
            res.send(result);
        })
        
             //get all users by database and send data to client side
        app.get('/users' , async(req , res) =>{
            const query = {} ; 
            const users = await usersCollections.find(query).toArray();
            res.send(users);
        })


        app.get('/users:email' , async(req , res) =>{
            const email = req.params.email;
            const query = { email : email }
            const user = await usersCollections.find(query).toArray();
            res.send(user);
        })
            //all user find and protect admin route
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollections.findOne(query);
            res.send({ isAdmin: user?.role === 'admin'});
        })

    }
    finally{

    }
}
run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('99 pro server running')
})

app.listen(port, () => console.log(`99 pro server listening on ${port}`))