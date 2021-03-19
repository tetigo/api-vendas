import { Request, Response } from "express";
import UpdateUserAvatarService from "../services/UpdateUserAvatarService";
import { classToClass } from "class-transformer";

class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const avatar_filename = req.file.filename
    const user_id = res.locals.userId 
    const updateAvatarService = new UpdateUserAvatarService()
    const user = await updateAvatarService.execute({ user_id, avatar_filename })
    return res.json(classToClass(user))
  }
}
export default UserAvatarController
