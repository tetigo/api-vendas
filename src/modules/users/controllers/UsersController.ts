import { Request, Response } from "express";
import CreateUserService from "../services/CreateUserService";
import ListUserService from "../services/ListUserService";
import { classToClass } from "class-transformer";

class UsersController {
  public async index(req: Request, res: Response): Promise<Response> {

    console.log('>>> autenticado com res.locals', res.locals.userId)
    // console.log('>>> autenticado com req.user.id', req.user.id)

    const listUsersService = new ListUserService()
    const users = await listUsersService.execute()
    return res.json(classToClass(users))
  }
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body
    const createUsersService = new CreateUserService()
    const user = await createUsersService.execute({ name, email, password })
    return res.json(classToClass(user))
  }
}
export default UsersController
