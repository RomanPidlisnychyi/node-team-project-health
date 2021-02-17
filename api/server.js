require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("combined"));

app.get("/", (req, res, next) => {
  console.log("All worked!");

  return res.status(200).json({ message: "All worked!" });
});

async function start() {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    };

    await mongoose.connect(process.env.MONGO_URL, options);

    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log("server started listening on port", PORT);
    });
  } catch (error) {
    console.log("Start up error", error);
    process.exit(1);
  }
}

start();
