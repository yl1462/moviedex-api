require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet') 
const movie = require('./movies-data.json')

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

app.get('/movie', (req, res) => {
  const { genre, country, avg_vote } = req.query
  // console.log(genre, country, avg_vote)
  let movies = movie
  
  if(genre) {
    movies = movies.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()))
  }

  if(country) {
    movies = movies.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()))
  }

  if(avg_vote) {
    movies = movies.filter(movie => movie.avg_vote >= parseFloat(avg_vote))
  }

  res.json(movies)
})

app.listen(8000, () => {
  console.log(`Server listening at http://localhost:8000`)
})