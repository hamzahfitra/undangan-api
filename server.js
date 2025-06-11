const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  await client.connect();
  db = client.db("undangan").collection("ucapan");
  console.log("MongoDB Connected");
}
connectDB();

app.post('/ucapan', async (req, res) => {
  const { nama, pesan, kehadiran } = req.body;
  if (!nama || !pesan || !kehadiran) return res.status(400).json({ error: "Lengkapi semua data." });

  const result = await db.insertOne({ nama, pesan, kehadiran, waktu: new Date() });
  res.json({ success: true, id: result.insertedId });
});

app.get('/ucapan', async (req, res) => {
  const data = await db.find().sort({ waktu: -1 }).toArray();
  res.json(data);
});

app.listen(port, () => {
  console.log(`API jalan di http://localhost:${port}`);
});
