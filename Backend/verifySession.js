import jwt from 'jsonwebtoken'

export const veritySession = async (req, res, next) => {
  const token = req.cookie.access_token
  if (!token) {
    return res.status(403).send('Access not Authorized')
  }

  let data = null
  req.session = { user: null }

  try {
    data = jwt.verify(token, 'secret-key')
    req.session.user = data
  } catch (error) {
    res.status(401).send('Access not Authorized')
  }

  next()
}
