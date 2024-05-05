const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials:true
}));
app.use(express.json());
app.use(cookieParser())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mrpyxhs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const serviceCollections = client.db('carDoctor').collection('services')
        const bookingCollection = client.db('carDoctor').collection('bookings')



        // auth reletad api ----------------------------------
        // app.post('/jwt', async(req, res) => {
        //     const user = req.body;
        //     console.log(user)
        //     const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1'})
        //     res
        //     .cookie('token',token,{
        //         httpOnly:true,
        //         secure:false,
        //         sameSite:'none'
        //     })
        //     .send({success:true})
        // })


        app.post('/jwt', async(req, res ) => {
            const user = req.body;
            console.log(user)
            // create a token 
            const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})

            res
            .cookie('token',token,{
                httpOnly:true,
                secure:false, // http://localhost:5173/login
                // sameSite:'none'
            })
            .send({success:true})
        })

        // service related api ------------------------------------
        app.get('/services', async (req, res) => {
            const cursor = serviceCollections.find()
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, service_id: 1, img: 1 },
            }

            const result = await serviceCollections.findOne(query, options)
            res.send(result)

        })


        // bookings -----------------

        app.get('/bookings', async (req, res) => {
            console.log(req.query.email)
            console.log('tok tok token' ,req.cookies.token)
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email }
            }

            const result = await bookingCollection.find(query).toArray();
            res.send(result)

        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking)
            const result = await bookingCollection.insertOne(booking)
            res.send(result)

        })


        app.patch('/bookings/:id', async(req,res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const updatebooking = req.body ;
            console.log(updatebooking)
            const updateDoc = {
                $set: {
                  status: updatebooking.status
                },
              };
              const result = await bookingCollection.updateOne(filter, updateDoc)
              res.send(result)

        })

        app.delete('/bookings/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await bookingCollection.deleteOne(query)
            res.send(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('doctore client')
})

app.listen(port, () => {
    console.log(`car doctor server is running on port : ${port}`)
})