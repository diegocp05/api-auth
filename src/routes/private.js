// src/routes/private.js
import express from 'express'
import prisma from '../services/prisma.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

// Rota GET protegida pelo middleware 'auth'
router.get('/listar-usuarios', auth, async (req, res) => {
    try {
        // Busca todos os usuários, mas SELECIONA apenas os campos seguros
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                // password: false -> implicitamente false ao não selecionar
            }
        })

        res.status(200).json({ message: "Usuários listados com sucesso", users })
    } catch (err) {
        res.status(500).json({ message: 'Falha no servidor' })
    }
})

export default router