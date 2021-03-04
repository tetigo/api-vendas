import { Request, Response } from "express";
import CreateSessionService from "../services/CreateSessionService";
import ListSessionService from "../services/ListSessionService";

class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body
    const createSessionService = new CreateSessionService()
    const user = await createSessionService.execute({ email, password })
    return res.json(user)
  }
  public async index(req: Request, res: Response): Promise<Response>{
    const listSessionService = new ListSessionService()
    const users = await listSessionService.execute()
    return res.json(users)
  }
}
export default SessionsController
