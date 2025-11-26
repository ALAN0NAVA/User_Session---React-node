import DBLocal from 'db-local'
import bcrypt from 'bcrypt'
import { validateUser } from '../validations/validateUser.js'

import crypto from 'node:crypto'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  username: { type: 'string', required: true },
  password: { type: 'string', required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    //             Validaciones
    const validationResult = validateUser({ username, password })
    if (!validationResult.success) {
      throw new Error(validationResult.error.issues[0].message)
    }
    // verificar que no exista el usuario
    const user = User.findOne({ username })
    if (user) throw new Error('Username already exists')
    // hashear la contraseña y crear ID
    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, 10)
    // crea el usuario en el local storage
    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()
    return id
  }

  static async login ({ username, password }) {
    //             Validaciones
    const validationResult = validateUser({ username, password })
    if (!validationResult.success) {
      throw new Error(validationResult.error.issues[0].message)
    }
    const user = await User.findOne({ username })
    if (!user) throw new Error('Invalid username or password')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('Invalid username or password')

    const { password: _, ...publicUser } = user

    return publicUser
  }
}
