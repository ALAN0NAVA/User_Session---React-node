import jwt from 'jsonwebtoken'

export class Controller {
  constructor ({ userRepository }) {
    this.userRepository = userRepository
  }

  login = async (req, res) => {
    const { username, password } = req.body
    try {
      const user = await this.userRepository.login({ username, password })
      const token = jwt.sign({ id: user._id, username: user.username },
        'secret-key',
        { expiresIn: '1h' })
      res
        .cookie('access_token', token, {
          httpOnly: true, // la cookie solo se puede acceder en el servidor
          secure: false, // solo se accede en https
          sameSite: 'lax', // solo se puede acceder en el mismo dominio
          maxAge: 1000 * 60 * 60 // validez de una hora
        })
        .send({ user, token })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  register = async (req, res) => {
    const { username, password } = req.body
    try {
      const id = await this.userRepository.create({ username, password })
      res
        .clearCookie('access_token')
        .json({ message: 'Logout Successful' })
        .send({ id })
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message })
    }
  }

  logout = async (req, res) => {
    res
      .clearCookie('access_token')
      .json({ message: 'Logout Successful' })
  }

  session = async (req, res) => {
    const { user } = req.session
    res.render('index', user)
  }
}
