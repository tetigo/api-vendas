import { Request, Response } from "express";
import UpdateUserAvatarService from "../services/UpdateUserAvatarService";
import { classToClass } from "class-transformer";

class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    // console.log('testeinnnnn', req.headers['content-disposition']?.split('; ')[2])
    // console.log('teeinnnnn', req.file.filename)
    const avatar_filename = req.file.filename
    const user_id = res.locals.user_id
    const updateAvatarService = new UpdateUserAvatarService()
    const user = updateAvatarService.execute({ user_id, avatar_filename })
    return res.json(classToClass(user))
  }
}
export default UserAvatarController
