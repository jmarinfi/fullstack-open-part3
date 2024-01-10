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
        req.method === 'POST' ? JSON.stringify(req.body): '',
    ].join(' ')
}))

app.use(cors())

app.use(express.static('dist'))


app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${entries.length} people</p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

// app.delete('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id)
//     entries = entries.filter(entry => entry.id !== id)

//     res.status(204).end()
// })

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    const entry = new Person({
        name: body.name,
        number: body.number,
    })

    entry.save().then(savedEntry => {
        res.json(savedEntry)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})