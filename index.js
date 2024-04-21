const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//jahidrony037
//qmH3vyyw0xGoSSPQ




const uri = "mongodb+srv://jahidrony037:qmH3vyyw0xGoSSPQ@atlascluster.k7qynmg.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //  client.connect();
    

    const database = client.db("usersDB");
    const userCollections =  database.collection("users");
    
    
    //{create user}
    app.get('/users', async(req,res)=>{
      const cursor = userCollections.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    app.post('/users', async (req,res)=>{
       const user = req.body;
       const result = await userCollections.insertOne(user)
       console.log(result);
        res.send(result);
    })

    //{remove user}

    app.delete('/users/:id', async(req,res)=>{
      const {userID} = req.params;
      // console.log( userID);
      const result = await userCollections.deleteOne(userID);
      // console.log(result);
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
      res.send(result);
    })




    //{update user }
    app.get('/users/:id', async(req, res)=>{
      const userID = req.params.id;
    //  console.log(userID);
      const id =new  ObjectId(userID);
      const result = await userCollections.findOne({'_id': id});
      // console.log(result);
      res.send(result);
      
    })

    app.put('/users/:id', async(req,res)=>{
      const user = req.body;
      console.log(user);
      const updateUser = {
        $set: {
          name:user?.name,
          email:user?.email
        },
      };
      const userID = req.params.id;
      const id = new ObjectId(userID);
      const options = { upsert: true };
      const result = await userCollections.updateOne({_id: id},updateUser,options);
      // console.log(result);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("simple server is running!");
})



app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
})