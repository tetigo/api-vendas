import { Request, Response } from "express";
import UpdateUserAvatarService from "../services/UpdateUserAvatarService";

class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const avatar_filename = req.file.filename
    const user_id = res.locals.user_id
    const updateAvatarService = new UpdateUserAvatarService()
    const user = updateAvatarService.execute({ user_id, avatar_filename })
    return res.json(user)
  }
}
export default UserAvatarController
