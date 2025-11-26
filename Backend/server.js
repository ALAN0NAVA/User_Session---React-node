import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

import { router } from './Controller/router.js'

const app = express()

app.use(express.json())
app.use(cors({
  origin: 'https://user-session-react-node.vercel.app',
  // origin: 'http://localhost:5173',
  credentials: true,
  methods: ["GET", "POST"]
}))
app.use(cookieParser())
app.disable('x-powered-by') // disable header that shows that the server is using expressdd

app.use('/session', router)

app.get('/checkSesion', (req, res) => {
  const token = req.cookies.access_token
  if (!token) {
    return res.status(403).send('Access not authorized')
  }
  try {
    const data = jwt.verify(token, 'secret-key')
    const { username } = data
    res.json({ username })
  } catch (error) {
    return res.status(403).send('Access not authorized')
  }
})

const PORT = process.env.PORT ?? 8080 // to use the port defined in environment variables or 1234
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})


