const express = require('express'); 
const jwt = require('jsonwebtoken'); 
const cors = require('cors');
require('dotenv').config(); 

const employeeRoutes = require('./routes/employeeRoutes'); 
const userRoutes = require('./routes/userRoutes');
const app = express(); 

// Middleware 
app.use(express.json()); 

// Permite todas las solicitudes de cualquier origen
app.use(cors());

// Middleware
app.use(cors({
    origin: ['http://localhost:4200'], 
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  app.use(express.urlencoded({ extended: false }));
  


// Rutas 
app.use('/api', employeeRoutes); 
app.use('/api', userRoutes);

// Ruta de prueba para generar un token (en un sistema real, esto iría en un controlador de autenticación) 
/*
app.post('/login', (req, res) => { 
    // Simulación de usuario 
    const user = { id: 1, username: 'admin' }; 
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' }); 
    res.json({ token }); 
}); 
    */
module.exports = app;