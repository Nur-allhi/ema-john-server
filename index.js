const express = require("express");
const cors = require("cors");

const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.ya1bp.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const DbProducts = client.db("ema-john").collection("products");
  const OrderedProducts = client.db("ema-john").collection("orders");
  app.post("/addProduct", (req, res) => {
    const products = req.body;
    DbProducts.insertOne(products).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  app.get("/products", (req, res) => {
    DbProducts.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/product/:key", (req, res) => {
    DbProducts.find({ key: req.params.key }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.post("/productsByKeys", (req, res) => {
    const productKeys = req.body;
    DbProducts.find({ key: { $in: productKeys } }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addOrder", (req, res) => {
    const orderInfo = req.body;
    OrderedProducts.insertOne(orderInfo).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Server Home");
});

app.listen(5000);
