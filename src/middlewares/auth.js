// src/middlewares/auth.js
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
    // Busca o token no Header da requisição
    const token = req.headers.authorization

    // Se não tiver token, barra o acesso (Erro 401: Unauthorized)
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado' })
    }

    try {
        // Remove a palavra "Bearer " se ela vier junto com o token (comum em frontends)
        const tokenLimpo = token.replace('Bearer ', '')

        // Decodifica e valida o token
        const decoded = jwt.verify(tokenLimpo, JWT_SECRET)

        // Adiciona o ID do usuário na requisição para usarmos depois se precisar
        req.userId = decoded.id

        next() // Pode prosseguir para a rota privada
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' })
    }
}

export default auth