const express = require('express')
const app = express()
const port = 3001

var morgan = require('morgan')

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


let entries = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


app.get('/api/persons', (req, res) => {
    res.json(entries)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${entries.length} people</p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const entry = entries.find(entry => entry.id === id)

    if (entry) {
        res.json(entry)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    entries = entries.filter(entry => entry.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (!body) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    if (entries.find(e => e.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const newEntry = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number
    }

    entries = entries.concat(newEntry)

    res.json(newEntry)
})


app.listen(port)