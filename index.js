require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())

//app.use(morgan('tiny'))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    '-',
    tokens['response-time'](req, res), 'ms',
    req.method === 'POST' ? JSON.stringify(req.body) : '',
  ].join(' ')
}))

app.use(cors())

app.use(express.static('dist'))


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }

    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      console.log(result)
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const entry = new Person({
    name: body.name,
    number: body.number,
  })

  entry.save()
    .then(savedEntry => {
      res.json(savedEntry)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number} = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedEntry => {
      res.json(updatedEntry)
    })
    .catch(error => next(error))
})


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message
    })
  }

  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})