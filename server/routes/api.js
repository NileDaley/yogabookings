const express = require('express')
const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

// Connect
const connection = closure => {
  return MongoClient.connect('mongodb://admin:SurprisedBadger@ds151544.mlab.com:51544/yogabookings', (err, db) => {
    if (err) return console.log(err)
    closure(db)
  })
}

// Error handling
const sendError = (err, res) => {
  response.status = 501
  response.message = typeof err == 'object' ? err.message : err
  res.status(501).json(response)
}

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
}

// Get users
router.get('/users', (req, res) => {
  connection(db => {
    db.collection('users')
      .find({"role": 0})
      .toArray()
      .then(users => {
        response.data = users
        res.json(response)
      })
      .catch(err => {
        sendError(err, res)
      })
  })
})

router.get('/locations', (req,res) => {
  connection(db => {
    db.collection('locations')
      .find()
      .toArray()
      .then(locations => {
        response.data = locations
        res.json(response)
      }).catch(err => {
        sendError(err,res)
      })
  })
})

router.post('/locations/update', (req, res) => {
  const newLoc = req.body;
  newLoc._id = ObjectID(newLoc._id);

  connection(db => {
    db.collection('locations')
      .replaceOne( { "_id": newLoc._id }, newLoc )
      .then(data => {
        data = data.result;
        const result = {
          status: data['n'] > 0  && data['nModified'] > 0,
          matched: data['n'],
          modified: data['nModified']
        }
        res.send(result);
      })
      .catch(err => {
        console.log("An error occured while trying to update the location");
      })
  })

})

module.exports = router
