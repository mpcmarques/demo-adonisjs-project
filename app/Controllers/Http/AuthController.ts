import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)

      const user = await User.findBy('email', email)

      return { user: user, token: token }
    } catch (e) {
      console.log(e)
      return response.badRequest('Invalid credentials')
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.logout()

    return true
  }

  public async check({ auth }: HttpContextContract) {
    const data = await auth.check()

    if (data === true) {
      const user = auth.authenticate()

      return user
    }

    return data
  }
}
