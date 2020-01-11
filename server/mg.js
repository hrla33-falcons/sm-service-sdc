const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Controller = require('../db/controller')
const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/../client/dist'))

// loaderio verification
app.get('/loaderio-84f46b8a0bcf09f289e60658c7a7f157', (req, res) => {
  res.status(200).sendFile(__dirname + '/loaderio-84f46b8a0bcf09f289e60658c7a7f157.txt')
})

app.get('/reviews', Controller.get)
app.get('/reviews/:id', Controller.getOne)
app.post('/reviews', Controller.post)
app.put('/reviews/:id', Controller.put)
app.delete('/reviews/:id', Controller.delete)

app.listen(3003, () => console.log('app listening on port 3003'))
