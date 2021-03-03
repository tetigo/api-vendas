import { Request, Response } from "express";
import CreateUserService from "../services/CreateUserService";
import ListUserService from "../services/ListUserService";

interface IRequest{
    name: string, 
    email: string,
    password: string
}

class UsersController{
    public async index(req: Request, res: Response):Promise<Response>{
        const listUsersService = new ListUserService()
        const users = await listUsersService.execute()
        return res.json(users)
    }
    public async create(req: Request, res: Response):Promise<Response>{
        const {name, email, password} = req.body as IRequest
        const createUsersService = new CreateUserService()
        const user = createUsersService.execute({name, email, password})
        return res.json(user)
    }
}
export default UsersController