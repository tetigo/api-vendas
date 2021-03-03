import AppError from "@shared/errors/AppError"
import { getCustomRepository } from "typeorm"
import User from "../entitties/users"
import UsersRepository from "../repositories/UsersRepository"

interface IRequest{
  name: string,
  email: string,
  password: string
}

class CreateUserService{
  public async execute({name, email, password}:IRequest): Promise<User | undefined>{
    const usersRepository = getCustomRepository(UsersRepository)
    let user = await usersRepository.findByEmail(email)
    if(user){
      throw new AppError('There is already one user with this email.')
    }
    user = usersRepository.create({
      name, email, password
    })
    usersRepository.save(user)
    return user
  }
}
export default CreateUserService
