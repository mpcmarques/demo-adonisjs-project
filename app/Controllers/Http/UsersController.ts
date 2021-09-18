import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { createUser, validationSchema } from 'App/Account'

export default class UsersController {
  public async get() {
    return await User.all()
  }

  public async post({ request, response, auth }: HttpContextContract) {
    try {
      // validate user
      const userDetails = await request.validate({ schema: validationSchema })

      // create the user
      const user = await createUser(userDetails.email, userDetails.name, userDetails.password)

      // auth user
      const token = await auth.use('api').attempt(userDetails.email, userDetails.password)

      // return the created user object
      return { user: user, token: token }
    } catch {
      return response.badRequest('This e-mail has been used')
    }
  }
}
