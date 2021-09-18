import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DashboardController {
  public async getFiles({ auth }: HttpContextContract) {
    if (auth.user) {
      await auth.user.load('files')

      return auth.user.files
    }
  }
  public async saveFile({ request, auth }: HttpContextContract) {
    const file = request.file('file')

    if (file && auth.user) {
      const fileSaved = await auth.user!.related('files').create({
        name: file.clientName,
      })

      await file.move(Application.tmpPath('temp'), {
        name: `${fileSaved.id} ${fileSaved.userId} ${fileSaved.name}`,
        overwrite: true,
      })
    }

    return true
  }

  public async downloadFile({ request, response }: HttpContextContract) {
    const file = request.input('file')

    return response.download(Application.tmpPath(`temp/${file.id} ${file.user_id} ${file.name}`))
  }
}
