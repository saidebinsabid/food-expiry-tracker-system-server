const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const admin = require("firebase-admin");
const serviceAccount = require("./food-expiry-tracker-syst-335a9-firebase-adminsdk-fbsvc-b7f3858b31.json");
app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-8majy7x-shard-00-00.z95nrcs.mongodb.net:27017,ac-8majy7x-shard-00-01.z95nrcs.mongodb.net:27017,ac-8majy7x-shard-00-02.z95nrcs.mongodb.net:27017/?ssl=true&replicaSet=atlas-xt6l7r-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyFireBaseToken = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized access!!" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token", decoded);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized acess!!" });
  }
};

const verifiedTokenEmail = (req, res, next) => {
  if (req.query.email !== req.decoded.email) {
    return res.status(403).send({ message: "Forbidden access" });
  }
  next();
};

async function run() {
  try {
    const addedFoodCollection = client
      .db("foodTracker")
      .collection("addedFood");

    app.get("/allFoodsItems", async (req, res) => {
      const { search = "", category = "" } = req.query;

      const query = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { foodCategory: { $regex: search, $options: "i" } },
        ];
      }
      if (category) {
        query.foodCategory = category;
      }

      try {
        const allFoodsItems = await addedFoodCollection.find(query).toArray();

        res.status(200).send(allFoodsItems);
      } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/nearly-expired-foods", async (req, res) => {
      try {
        const foods = await addedFoodCollection
          .find({})
          .sort({ expiryDate: 1 })
          .limit(8)
          .toArray();

        res.json(foods);
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ message: "Error fetching nearly expired foods" });
      }
    });

    app.get("/expired-food-items", async (req, res) => {
      const today = new Date();
      try {
        const foods = await addedFoodCollection
          .find({ expiryDate: { $lt: today } })
          .sort({ expiryDate: -1 })
          .toArray();
        res.json(foods);
      } catch (error) {
        res.status(500).json({ message: "Error fetching expired foods" });
      }
    });

    app.get(
      "/my-food-items",
      verifyFireBaseToken,
      verifiedTokenEmail,
      async (req, res) => {
        const userEmail = req.query.email;
        if (!userEmail) {
          return res.status(400).send({ message: "Email Required" });
        }
        const myItems = await addedFoodCollection
          .find({ email: userEmail })
          .toArray();
        res.send(myItems);
      }
    );

    app.get("/added-food/:id", async (req, res) => {
      const foodItemId = req.params.id;
      try {
        const foodItem = await addedFoodCollection.findOne({
          _id: new ObjectId(foodItemId),
        });
        if (!foodItem) {
          return res.status(404).json({ message: "Food item not found" });
        }
        res.json(foodItem);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.post("/added-food/:id/notes", verifyFireBaseToken, async (req, res) => {
      const { id } = req.params;
      const { note } = req.body;

      if (!note || !note.trim()) {
        return res.status(400).json({ message: "Missing note content" });
      }

      try {
        const foodItem = await addedFoodCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!foodItem)
          return res.status(404).json({ message: "Food not found" });

        const newNote = {
          note: note.trim(),
          postedDate: new Date(),
        };

        await addedFoodCollection.updateOne(
          { _id: new ObjectId(id) },
          { $push: { notes: newNote } }
        );

        res
          .status(200)
          .json({ message: "Note added successfully", note: newNote });
      } catch (error) {
        console.error("Error adding note:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.post("/added-food", verifyFireBaseToken, async (req, res) => {
      const newFood = req.body;

      if (newFood.expiryDate) {
        newFood.expiryDate = new Date(newFood.expiryDate);
      }

      const result = await addedFoodCollection.insertOne(newFood);
      res.send(result);
    });

    app.put("/update-item/:id", verifyFireBaseToken, async (req, res) => {
      const itemId = req.params.id;
      const updateData = req.body;

      if (updateData.expiryDate) {
        updateData.expiryDate = new Date(updateData.expiryDate);
      }

      try {
        const result = await addedFoodCollection.updateOne(
          { _id: new ObjectId(itemId) },
          { $set: updateData }
        );
        res.json({ modifiedCount: result.modifiedCount });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update item" });
      }
    });
    app.delete("/food-items/:id", verifyFireBaseToken, async (req, res) => {
      const id = req.params.id;
      const result = await addedFoodCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Food Expiry Server...");
});

app.listen(port, () => {
  console.log(`Food Expiry Server is running on port, ${port}`);
});
