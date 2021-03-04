import { getCustomRepository } from "typeorm";
import User from "../typeorm/entities/users";
import UsersRepository from "../typeorm/repositories/UsersRepository";

class ListSessionService{
  public async execute():Promise<User[]>{
    const usersRepository = getCustomRepository(UsersRepository)
    const users = await usersRepository.find()
    return users
  }
}
export default ListSessionService
