// src/server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'

dotenv.config() // Carrega as variáveis do .env

const app = express()

// Habilita JSON para ler o body das requisições
app.use(express.json())
// Habilita CORS (para aceitar requisições de outros domínios/frontend)
app.use(cors())

// Usa as rotas
app.use('/', publicRoutes)  // Rotas públicas (ex: localhost:3000/cadastro)
app.use('/', privateRoutes) // Rotas privadas (ex: localhost:3000/listar-usuarios)

const PORT = 3000

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`)
})