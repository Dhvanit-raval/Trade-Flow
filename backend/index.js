require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser")
const authRoute = require("./routes/AuthRoute");
const jwt = require("jsonwebtoken");
const User = require("./model/UserModel");

const { HoldingsModel } = require("./model/HoldingsModels");
const { PositionModel } = require("./model/PositionModel");
const { OrderModel } = require("./model/OrderModel");

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5174", "http://localhost:5173", "https://dhvanit-raval.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
  });


app.use("/", authRoute);

app.get("/user", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) return res.json({ status: true, user: user.username });
      else return res.json({ status: false });
    }
  });
});

app.get('/allHoldings', async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get('/allPosition', async (req, res) => {
  let allPosition = await PositionModel.find({});
  res.json(allPosition);
});

app.post("/newOrder", async (req, res) => {
  let newOrder = new OrderModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });

  await newOrder.save();

  if (req.body.mode === "Buy") {
    let holding = await HoldingsModel.findOne({ name: req.body.name });
    if (holding) {
      let newQty = parseInt(holding.qty) + parseInt(req.body.qty);
      let newAvg = ((holding.avg * holding.qty) + (req.body.price * req.body.qty)) / newQty;
      holding.qty = newQty;
      holding.avg = newAvg;
      await holding.save();
    } else {
      let newHolding = new HoldingsModel({
        name: req.body.name,
        qty: req.body.qty,
        avg: req.body.price,
        price: req.body.price,
        net: "0.0%",
        day: "0.0%",
      });
      await newHolding.save();
    }
  } else if (req.body.mode === "Sell") {
    let holding = await HoldingsModel.findOne({ name: req.body.name });
    if (holding) {
      let newQty = parseInt(holding.qty) - parseInt(req.body.qty);
      if (newQty <= 0) {
        await HoldingsModel.deleteOne({ name: req.body.name });
      } else {
        holding.qty = newQty;
        await holding.save();
      }
    }
  }

  res.send("Order saved!");
});

app.get('/allOrders', async (req, res) => {
  let allOrders = await OrderModel.find({});
  res.json(allOrders);
});


// app.get('/addPositions', async (req, res) => {
//     let tempPosition = [{
//         product: "CNC",
//         name: "EVEREADY",
//         qty: 2,
//         avg: 316.27,
//         price: 312.35,
//         net: "+0.58%",
//         day: "-1.24%",
//         isLoss: true,
//     },
//     {
//         product: "CNC",
//         name: "JUBLFOOD",
//         qty: 1,
//         avg: 3124.75,
//         price: 3082.65,
//         net: "+10.04%",
//         day: "-1.35%",
//         isLoss: true,
//     },];

//     tempPosition.forEach(async (data) => {
//         let newPosition = new PositionModel({
//             product: data.product,
//             name: data.name,
//             qty: data.qty,
//             avg: data.avg,
//             price: data.price,
//             net: data.net,
//             day: data.day,
//             isLoss: data.isLoss,
//         });
//         newPosition.save();
//     });
//     res.send("DOne!");
//     console.log("Done");
// });