const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
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
        const wishlistCollections = client.db('99proBusinessSite').collection('wishlist')
        const cartCollections = client.db('99proBusinessSite').collection('cart') 
        const paymentCollections = client.db('99proBusinessSite').collection('payment')
       const petCollections = client.db('99proBusinessSite').collection('petItems') 
       const gadgetCollections = client.db('99proBusinessSite').collection('onlyGadgets')
       // NOTE: make sure you use verifyAdmin after verifyJWT
        const verifyAdmin = async (req, res, next) => {
        // const decodedEmail = req.decoded.email;
        const query = { email: decodedEmail };
        const user = await usersCollections.findOne(query);
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
          app.get('/petItems', async (req, res) => {
            const query = {};
            const pets = await petCollections.find(query).toArray();
            res.send(pets);
          })
           app.get('/Gadgets', async (req, res) => {
            const query = {};
            const gadgets = await gadgetCollections.find(query).toArray();
            res.send(gadgets);
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
  //all user find and protect admin route
        app.get('/allProducts/admin/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id }
            const user = await AllProductsCollections.findOne(query);
            res.send({ isAdmin: user?.role === 'admin'});
        })
          // check product stock out or not:
    app.put("/allProducts/verify/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          verification: "stockOut",
        },
      };
      const result = await AllProductsCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

     app.put('/users/admin/:id',  async(req , res) => {
           
            const id = req.params.id;
              const filter = {_id:ObjectId(id)}
              const options = {upsert: true};
              const updatedDoc = {
                $set: {
                  verification: 'goldenUser'
                }
              }
              const result = await usersCollections.updateOne(filter,  updatedDoc, options);
              res.send(result);
           });

 app.get('/users', async (req, res) => {
             const query = {};
             const users = await usersCollections.find(query).toArray();
             res.send(users);

         })
 // ----delete product----
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await AllProductsCollections.deleteOne(query);
      res.send(result);
    });

     app.post("/wishlist", async (req, res) => {
        const wishlist = req.body;
        const result = await wishlistCollections.insertOne(wishlist);
        res.send(result);
    });

    app.get('/wishlist',async (req,res)=>{
const email = req.query.email
const query = {email: email}
const wishlist = await wishlistCollections.find(query).toArray();
res.send(wishlist);
})

app.post("/cart", async (req, res) => {
        const cart = req.body;
        const result = await cartCollections.insertOne(cart);
        res.send(result);
    });

    app.get('/cart',async (req,res)=>{
const email = req.query.email
const query = {email: email}
const cart = await cartCollections.find(query).toArray();
res.send(cart);
})

//  app.put("/cart/pay/:email", async (req, res) => {
//       const email = req.params.id;
//       const filter = { email: new ObjectId(email) };
//       const options = { upsert: true };
//       const updatedDoc = {
//         $set: {
//           payment: "CashOnPaid",
//         },
//       };
//       const result = await cartCollections.updateOne(
//         filter,
//         updatedDoc,
//         options
//       );
//       res.send(result);
//     });


    // Bookings Create on database:
    app.post("/payment", async (req, res) => {
      const bookings = req.body;
      const result = await paymentCollections.insertOne(bookings);
      res.send(result);
    });

      // app.get('/payment', async (req, res) => {
      //     const email = req.query.email
      //     const query = {
      //         email: email
      //     }
      //     const cart = await paymentCollections.find(query).toArray();
      //     res.send(cart);
      // })
      app.get('/payment', async (req, res) => {
             const query = {};
             const payment = await paymentCollections.find(query).toArray();
             res.send(payment);
         })
    // Get Bookings Data from database on table:
    // app.get("/payment", async (req, res) => {
    //   const email = req.query.email;
    //    /* const decodedEmail = req.decoded.email;

    //   if (email !== decodedEmail) {
    //     return res.status(403).send({ message: "forbidden access" });
    //   }  */
    //   // console.log(email)
    //   console.log('token',req.headers.authorization)
    //   const query = { email: email };
    //   const bookings = await paymentCollections.find(query).toArray();
    //   res.send(bookings);
    // });
     }

    
    finally{

    }
}
run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('99 pro server running')
})

app.listen(port, () => console.log(`99 pro server listening on ${port}`))