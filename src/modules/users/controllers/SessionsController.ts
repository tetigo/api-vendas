import { Request, Response } from "express";
import CreateSessionService from "../services/CreateSessionService";
import { classToClass } from "class-transformer";

class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    const createSessionService = new CreateSessionService()
    const user = await createSessionService.execute({ email, password })
    return res.json(classToClass(user))
  }
}
export default SessionsController
