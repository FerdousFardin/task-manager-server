const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.p9sfd7v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const database = client.db("task-manager");
    const tasksCollection = database.collection("tasks");

    app.get("/tasks", async (req, res) => {
      const tasks = await tasksCollection.find({}).sort({ date: -1 }).toArray();
      res.send(tasks);
    });
    app.post("/tasks", async (req, res) => {
      const tasksBody = req.body;
      const results = await tasksCollection.insertOne(tasksBody);
      res.send(results);
    });
    app.put("/tasks", async (req, res) => {
      const updatedTask = req.body;
      const { id, ...rest } = req.body;
      const filter = { _id: ObjectId(id), rest };
      const results = await tasksCollection.updateOne(filter, updatedTask, {
        upsert: true,
      });
      res.send(results);
      app.delete("/tasks", async (req, res) => {
        const { id, ...rest } = req.body;
        const filter = { _id: ObjectId(id), rest };
        const results = await tasksCollection.deleteOne(filter);
      });
    });
  } finally {
  }
}
run().catch((er) => console.error(er));

app.get("/", (req, res) => {
  res.send("Server responded");
});
app.listen(port, () => {});
