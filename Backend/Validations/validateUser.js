import z from 'zod'

const userSchema = z.object({
  username: z.string({
    invalid_type_error: 'El nombre debe ser una cadena de texto',
    required_error: 'El nombre es obligatorio'
  }).min(6, 'El nombre de usuario debe tener al menos 6 caracteres'),
  password: z.string({
    invalid_type_error: 'La contraseña debe ser una cadena de texto',
    required_error: 'La contraseña es obligatoria'
  }).min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export function validateUser (input) {
  return userSchema.safeParse(input)
}
