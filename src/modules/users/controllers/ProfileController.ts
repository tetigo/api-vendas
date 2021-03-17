import { Request, Response } from "express";
import ShowProfileService from "../services/ShowProfileService";
import UpdateProfileService from "../services/UpdateProfileService";

import { classToClass } from "class-transformer";

class ProfileController {
    public async show(req: Request, res: Response): Promise<Response> {
        console.log('===>>>', res.locals.userId)
        const user_id = res.locals.userId
        const showProfileService = new ShowProfileService()
        const user = await showProfileService.execute({ user_id })
        return res.json(classToClass(user)) //faz inibir algo definido na Entidade User, no caso, password
    }
    public async update(req: Request, res: Response): Promise<Response>{
        const user_id = res.locals.userId
        const {name, email, password, old_password} = req.body
        const updateProfileService = new UpdateProfileService()
        const user = await updateProfileService.execute({user_id, name, email, password, old_password})
        return res.json(classToClass(user))
    }
}
export default ProfileController