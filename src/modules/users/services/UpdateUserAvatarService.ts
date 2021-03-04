import AppError from "@shared/errors/AppError"
import { getCustomRepository } from "typeorm"
import User from "../typeorm/entities/users"
import UsersRepository from "../typeorm/repositories/UsersRepository"

interface IRequest{
  user_id: string,
  avatar_filename: string,
}

//pra usar esse serviço, o usuario já foi autenticado, então já possui user_id
class UpdateUserAvatarService{
  public async execute({user_id, avatar_filename }:IRequest): Promise<User>{
    const usersRepository = getCustomRepository(UsersRepository)
    const user = usersRepository.findById(user_id)
    if(!user){
      throw new AppError('User not found')
    }

    if(){


    }


    return user
  }
}
export default UpdateUserAvatarService
