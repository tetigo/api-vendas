import { Request, Response } from "express";
import ShowProfileService from "../services/ShowProfileService";
import UpdateProfileService from "../services/UpdateProfileService";

class ProfileController {
    public async show(req: Request, res: Response): Promise<Response> {
        console.log('===>>>', res.locals.userId)
        const user_id = res.locals.userId
        const showProfileService = new ShowProfileService()
        const user = await showProfileService.execute({ user_id })
        return res.json(user)
    }
    public async update(req: Request, res: Response): Promise<Response>{
        const user_id = res.locals.userId
        const {name, email, password, old_password} = req.body
        const updateProfileService = new UpdateProfileService()
        const user = await updateProfileService.execute({user_id, name, email, password, old_password})
        return res.json(user)
    }
}
export default ProfileController