const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// midleware to use and allow request from all origins
app.use(cors());

// Middleware para registrar logs das requisições HTTP
app.use(morgan('tiny'));

// Middleware para analisar corpos JSON
app.use(express.json());


// Custom Morgan Token to log request body
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
  });
  
  // Middleware for logging HTTP requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


// Serve static files from the "public" directory
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

// Dados de exemplo
let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' },
];

//rota oara obter todas as pessoas
app.get('/api/persons', (req, res) => {
    res.json(persons);
});


// Rota para obter uma pessoa pelo ID
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).send({ error: 'Person not found' });
    }
});

// Rota para deletar uma pessoa pelo ID
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);

    res.status(204).end(); // Sem conteúdo
});

// Rota para adicionar uma nova pessoa
app.post('/api/persons', (req, res) => {
    const body = req.body;

    // Verificar se o nome ou número estão ausentes
    if (!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'Name or number is missing' 
        });
    }

    // Verificar se o nome já existe no livro de telefone
    if (persons.some(p => p.name === body.name)) {
        return res.status(400).json({ 
            error: 'Name must be unique' 
        });
    }

    // Gerar um ID único
    let newId;
    do {
        newId = Math.floor(Math.random() * 1000000);
    } while (persons.some(p => p.id === newId));

    const person = {
        id: newId,
        name: body.name,
        number: body.number,
    };

    persons = persons.concat(person);

    res.json(persons);
});

// Serve the frontend (index.html) for any route not handled by the above routes
app.get('*', (req, res) => {
    // eslint-disable-next-line no-undef
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("nice")
});
