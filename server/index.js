const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Controller = require('../db/controller')
const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/../client/dist'))

// Mongo version
app.get('/reviews', Controller.get)
app.get('/reviews/:id', Controller.getOne)
app.post('/reviews', Controller.post)
app.put('/reviews/:id', Controller.put)
app.delete('/reviews/:id', Controller.delete)

app.listen(3003, () => console.log('app listening on port 3003'))
