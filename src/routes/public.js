// src/routes/public.js
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../services/prisma.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

// ROTA DE CADASTRO
router.post('/cadastro', async (req, res) => {
    try {
        const { email, name, password } = req.body

        // Verifica se usuário já existe (Segurança)
        const userExists = await prisma.user.findUnique({ where: { email } })
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe' })
        }

        // Criptografa a senha com Bcrypt
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        // Cria o usuário no MongoDB
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashPassword
            }
        })

        res.status(201).json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Erro no Servidor, tente novamente' })
    }
})

// ROTA DE LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        // Busca usuário pelo email
        const user = await prisma.user.findUnique({ where: { email } })

        // Se usuário não existe ou senha não bate
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        // Compara a senha enviada com o Hash do banco
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Senha inválida' })
        }

        // Gera o Token JWT (Expira em 1 dia, pode ajustar para '7d', '1h' etc)
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' })

        res.status(200).json({ token, userId: user.id }) // Retorna o token para o Frontend
    } catch (err) {
        res.status(500).json({ message: 'Erro no Servidor' })
    }
})

export default router