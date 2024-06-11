const express = require('express');
const http = require('http');
const { default: mongoose } = require('mongoose');
const authroutes = require("./routes/authroutes");
const tokenverify=require("./middleware/isauth");
const cors = require("cors");
const path = require("path")
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
const server = http.createServer(app);

mongoose.set('strictQuery', true);
mongoose.connect(process.env.dburl)
  .then(result => {
    server.listen(2000)
    console.log("connected");
  }).catch(err => {
    console.log(err);
  });


app.use("/auth", authroutes);
app.post("/status",tokenverify.verifytoken,status)

app.use('/', (req, res) => {
  res.json({ msg: "success" })
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});