import AppError from "@shared/errors/AppError"
import { getCustomRepository } from "typeorm"
import User from "../typeorm/entities/users"
import UsersRepository from "../typeorm/repositories/UsersRepository"
import { hash } from "bcryptjs";

interface IRequest{
  name: string,
  email: string,
  password: string
}

class CreateUserService{
  public async execute({name, email, password}:IRequest): Promise<User>{
    const usersRepository = getCustomRepository(UsersRepository)
    const emailExists = await usersRepository.findByEmail(email)
    if(emailExists){
      throw new AppError('There is already one user with this email.')
    }

    const hashedPassword = await hash(password, 8)

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword
    })
    await usersRepository.save(user)
    return user
  }
}
export default CreateUserService
