import { Router } from 'express'
import { Controller } from './controller.js'
import { UserRepository } from '../Models/local-file.js'

const controller = new Controller({ userRepository: UserRepository })
export const router = Router()

router.post('/login', controller.login)
router.post('/register', (controller.register))
router.post('/session', controller.session)
router.get('/logout', controller.logout)
