const express = require("express")
const mongo = require("mongodb").MongoClient

const url = "mongodb://localhost:27017"

let db, trips, expenses

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db("tripcost")
    trips = db.collection("trips")
    expenses = db.collection("expenses")
  }
)

const app = express()
app.listen(3000, () => console.log("Server ready"))
app.use(express.json())

/* 
* Create new trip
*/
app.post("/trip", (req, res) => {
  const name = req.body.name
  if(!name){
    res.status(400).json({ error: 'name Params is required '})
    return 
  }
  trips.insertOne({ name: name }, (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err })
      return
    }
    console.log(result)
    res.status(200).json({ success: true, message: "trip saved successfully" })
  })
})

/* 
* Get list of trips
*/
app.get("/trips", (req, res) => {
  trips.find().toArray((err, items) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err })
      return
    }
    res.status(200).json({ trips: items })
  })
})

/* 
* Create new expense
*/
app.post("/expense", (req, res) => {
  expenses.insertOne(
    {
      trip: req.body.trip,
      date: req.body.date,
      amount: req.body.amount,
      category: req.body.category,
      description: req.body.description,
    },
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
      }
      res.status(200).json({ success: true, message: "expense saved successfully" })
    }
  )
})

/* 
* get a single expense
*/
app.get("/expenses", (req, res) => {
  const trip = req.body.trip
  if(!trip){
    res.status(400).json({ error: 'trip Params is required '})
    return
  }
  expenses.find({ trip: trip }).toArray((err, items) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err })
      return
    }
    res.status(200).json({ expenses: items })
  })
})
