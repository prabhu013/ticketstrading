const express = require('express')
const app = express()
const port = 5000

require("dotenv").config();

app.use((req,res,next)=> {
  res.setHeader("Access-Control-Allow-Origin","http:localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
})

const mongoDB = require('./db');
mongoDB();



app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(express.json())
app.use('/api',require("./createUser"));
app.use('/api',require("./displaydata"));
app.use('/check',require("./checkrequest"));
app.use('/payment',require("./payment/paymentorder"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})