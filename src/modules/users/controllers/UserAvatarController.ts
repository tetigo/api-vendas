import { Request, Response } from "express";
import UpdateUserAvatarService from "../services/UpdateUserAvatarService";
import { classToClass } from "class-transformer";

class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    // console.log('req.file.filename', req.file.filename, 'res.locals.filename', res.locals.filename)
    // console.log('req.file.path', req.file.path)
    // let avatar_filename = req.headers['content-disposition']?.split('; ')[2].split('=')[1].replace('"','').replace('"','')
    const avatar_filename = req.file.filename
    const user_id = res.locals.userId 
    const updateAvatarService = new UpdateUserAvatarService()
    //@ts-ignore
    const user = await updateAvatarService.execute({ user_id, avatar_filename })
    return res.json(classToClass(user))
  }
}
export default UserAvatarController
