import { compare } from "bcryptjs";
import AppError from "@shared/errors/AppError"
import { getCustomRepository } from "typeorm"
import User from "../typeorm/entities/users"
import UsersRepository from "../typeorm/repositories/UsersRepository"

interface IRequest{
  email: string,
  password: string
}

class CreateSessionService{
  public async execute({email, password}: IRequest): Promise<User>{
    const usersRepository = getCustomRepository(UsersRepository)
    const user = await usersRepository.findByEmail(email)
    if(!user){
      throw new AppError('Invalid Combination of Email/Password1', 401)
    }
    const isValidPass = await compare(password, user.password)
    if(!isValidPass){
      throw new AppError('Invalid Combination of Email/Password2', 403)
    }
    return user
  }
}
export default CreateSessionService
