import User from '../Models/User'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export const validationSchema = schema.create({
  email: schema.string({ trim: true }, [
    rules.email(),
    rules.unique({ table: 'users', column: 'email' }),
  ]),
  password: schema.string({ trim: true }),
  name: schema.string(),
})

export const createUser = async (email: string, name: string, password: string) => {
  const user = new User()
  user.name = name
  user.email = email
  user.password = password

  return await user.save()
}
