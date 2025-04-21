const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/brainly", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the schema and model
const contentSchema = new mongoose.Schema({
  title: String,
  link: String,
  tags: [String],
  userId: mongoose.Schema.Types.ObjectId, // Updated userId to be a single ObjectId
});

const Content = mongoose.model("Content", contentSchema);

// Sample data
const data = [
  {
    title: "The Future of Renewable Energy",
    link: "https://example.com/future-renewable-energy",
    tags: ["energy", "future", "renewable"],
    userId: new mongoose.Types.ObjectId("67fb6a56f8737b0dd23447b5"),
  },
  {
    title: "AI in Space Exploration",
    link: "https://example.com/ai-space-exploration",
    tags: ["AI", "space", "exploration"],
    userId: new mongoose.Types.ObjectId("67fb6a56f8737b0dd23447b5"),
  },
  {
    title: "The Impact of 5G on Communication",
    link: "https://example.com/5g-communication",
    tags: ["5G", "communication", "technology"],
    userId: new mongoose.Types.ObjectId("67fb6a56f8737b0dd23447b5"),
  },
  {
    title: "Breakthroughs in Genetic Engineering",
    link: "https://example.com/genetic-engineering",
    tags: ["genetics", "engineering", "health"],
    userId: new mongoose.Types.ObjectId("67fb6a56f8737b0dd23447b5"),
  },
  {
    title: "The Role of Robotics in Manufacturing",
    link: "https://example.com/robotics-manufacturing",
    tags: ["robotics", "manufacturing", "technology"],
    userId: new mongoose.Types.ObjectId("67fb6a56f8737b0dd23447b5"),
  },
  {
    title: "The Future of Autonomous Vehicles",
    link: "https://example.com/autonomous-vehicles",
    tags: ["technology", "vehicles", "autonomous"],
    userId: new mongoose.Types.ObjectId("67fb6a56f8737b0dd23447b5"),
  },
  {
    title: "The Impact of Climate Change on Wildlife",
    link: "https://example.com/climate-change-wildlife",
    tags: ["climate", "wildlife", "environment"],
    userId: new mongoose.Types.ObjectId("67fb6a56f8737b0dd23447b5"),
  },
  {
    title: "Advances in Biotechnology",
    link: "https://example.com/biotechnology-advances",
    tags: ["biotech", "health", "innovation"],
    userId: new mongoose.Types.ObjectId("67fb6a56f8737b0dd23447b5"),
  },
  {
    title: "The Role of AI in Cybersecurity",
    link: "https://example.com/ai-cybersecurity",
    tags: ["AI", "cybersecurity", "technology"],
    userId: new mongoose.Types.ObjectId("67fb6a56f8737b0dd23447b5"),
  },
  {
    title: "Exploring Renewable Energy Sources",
    link: "https://example.com/renewable-energy-sources",
    tags: ["energy", "renewable", "sustainability"],
    userId: new mongoose.Types.ObjectId("67fb6a56f8737b0dd23447b5"),
  },
];

// Insert data into the database
Content.insertMany(data)
  .then(() => {
    console.log("Data inserted successfully!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error inserting data:", err);
    mongoose.connection.close();
  });