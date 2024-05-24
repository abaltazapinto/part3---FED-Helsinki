const { number } = require("joi");
const express = require("express");
const app = express();
const PORT = 3001;

//midleware to parse JSON data
app.use(express.json());

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id:2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id:3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id:4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122'
    }
]

//info
app.get('/info', (req, res) => {
    const date = new Date();
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>`
    );
}); 

//Route to get one person
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if(person){
        res.json(person);
    }else{
        res.status(404).send('Person not found');
    }
});

//Route to delete a person
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

//Route de POST or add a new person
app.post('/api/persons', (req, res) => {
    const body = req.body;


    if(!body.number){
        return res.status(400).json({
            error: 'number missing'
        });
    }
    if(!body.name){
        return res.status(400).json({
            error: 'name missing'
        });
    }
    if(persons.some(person => person.name === body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        });
    }


    //  Gerar um id unico
    let newID;
    do{
        newID = Math.floor(Math.random() * 10000);
    }   while(persons.some(person => person.id === newID));

    const person = {
        id: newID,
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person);
    res.json(person);
});

app.get('/api/persons', (req, res) => {
    res.send(persons);
});

// Start the seerver
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});